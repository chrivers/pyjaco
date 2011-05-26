import ast
import py2js.compiler
from py2js.compiler import JSError
from py2js.compiler.multiplexer import dump

class Compiler(py2js.compiler.BaseCompiler):

    def __init__(self):
        super(Compiler, self).__init__()
        self.future_division = False

    def visit_Module(self, node):
        module = []

        for stmt in node.body:
            module.extend(self.visit(stmt))

        return module

    def visit_FunctionDef(self, node):
        is_static = False
        is_javascript = False
        if node.decorator_list:
            if len(node.decorator_list) == 1 and \
                    isinstance(node.decorator_list[0], ast.Name) and \
                    node.decorator_list[0].id == "JavaScript":
                is_javascript = True # this is our own decorator
            elif self._class_name and \
                    len(node.decorator_list) == 1 and \
                    isinstance(node.decorator_list[0], ast.Name) and \
                    node.decorator_list[0].id == "staticmethod":
                is_static = True
            else:
                raise JSError("decorators are not supported")

        js_args = []
        js_defaults = []

        defaults = [None]*(len(node.args.args) - len(node.args.defaults)) + node.args.defaults

        for arg, default in zip(node.args.args, defaults):
            if not isinstance(arg, ast.Name):
                raise JSError("tuples in argument list are not supported")

            js_args.append(arg.id)

            if default is not None:
                js_defaults.append("%(id)s = typeof(%(id)s) != 'undefined' ? %(id)s : %(def)s;\n" % { 'id': arg.id, 'def': self.visit(default) })

        if node.decorator_list and not is_static and not is_javascript:
            raise JSError("decorators are not supported")

        self._scope = [arg.id for arg in node.args.args]

        if self._class_name:
            if not is_static:
                if not (js_args[0] == "self"):
                    raise NotImplementedError("The first argument must be 'self'.")
                del js_args[0]
            js = ["Function(function(%s) {" % (", ".join(js_args))]
        else:
            js = ["var %s = Function(function(%s) {" % (node.name, ", ".join(js_args))]

        js.extend(self.indent(js_defaults))

        if node.args.vararg:
            if self._class_name:
                l = len(node.args.args)-1
            else:
                l = len(node.args.args)
            js.append("var %s = tuple.__call__(Array.prototype.slice.call(arguments, %s));" % (node.args.vararg, l))

        if node.args.kwarg:
            js.append("var %s = dict.__call__(arguments.callee.__kw_args);" % node.args.kwarg)

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

            # #If method is static, we also add it directly to the class
            # if is_static:
            #     js.append("%s.%s = %s.prototype.%s;" % \
            #             (self._class_name, node.name, self._class_name, node.name))
            # #Otherwise, we wrap it to take 'self' into account
            # else:
            #     func_name = node.name
            #     js.append("%s.%s = function() {" % (self._class_name, func_name))
            #     js.append("    %s.prototype.%s.apply(arguments[0],Array.slice(arguments,1));"% (self._class_name, func_name))
            #     js.append("}")

        self._scope = []
        return js + ["});"]

    def visit_ClassDef(self, node):
        js = []
        bases = [self.visit(n) for n in node.bases]
        if not bases:
            bases = ['object']
        if len(bases) == 0:
            raise JSError("Old-style classes not supported")
        elif len(bases) > 1:
            raise JSError("Multiple inheritance not supported")

        class_name = node.name
        #self._classes remembers all classes defined
        self._classes[class_name] = node

        if len(self._class_name) > 0:
            js.append("__inherit(%s, \"%s\");" % (bases[0], class_name))
        else:
            js.append("var %s = __inherit(%s, \"%s\");" % (class_name, bases[0], class_name))

        self._class_name.append(class_name)
        heirar = ".prototype.".join(self._class_name + [])
        for stmt in node.body:
            if isinstance(stmt, ast.Assign):
                value = self.visit(stmt.value)
                for t in stmt.targets:
                    var = self.visit(t)
                    js.append("%s.prototype.%s = %s;" % (heirar, var, value))
            elif isinstance(stmt, ast.FunctionDef):
                js.append("%s.prototype.%s = %s;" % (heirar, stmt.name, "\n".join(self.visit(stmt))))
            elif isinstance(stmt, ast.ClassDef):
                js.append("%s.prototype.%s = %s;" % (heirar, stmt.name, "\n".join(self.visit(stmt))))
            elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Str):
                js.append("\n".join(["/* %s */" % s for s in stmt.value.s.split("\n")]))
            elif isinstance(stmt, ast.Pass):
                # Not required for js
                pass
            else:
                raise JSError("Unsupported class data: %s" % stmt)
        self._class_name.pop()

        return js

    def visit_Return(self, node):
        if node.value is not None:
            return ["return %s;" % self.visit(node.value)]
        else:
            return ["return;"]

    def visit_Delete(self, node):
        return [self.visit_DeleteSimple(part) for part in node.targets]

    def visit_DeleteSimple(self, node):
        if isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Index):
            js = "%s.__delitem__(%s);" % (self.visit(node.value), self.visit(node.slice))
        elif isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Slice):
            js = "%s.__delslice__(%s, %s);" % (self.visit(node.value), self.visit(node.slice.lower), self.visit(node.slice.upper))
        elif isinstance(node, ast.Attribute):
            js = '%s.__delattr__("%s");' % (self.visit(node.value), node.attr)
        elif isinstance(node, ast.Name):
            raise JSError("Javascript does not support deleting variables. Cannot compile")
        else:
            raise JSError("Unsupported delete type: %s" % node)

        return js

    def visit_AssignSimple(self, target, value):
        if isinstance(target, (ast.Tuple, ast.List)):
            dummy = self.alloc_var()
            js = ["var %s = %s;" % (dummy, value)]

            for i, target in enumerate(target.elts):
                var = self.visit(target)
                declare = ""
                if isinstance(target, ast.Name):
                    if not (var in self._scope):
                        self._scope.append(var)
                        declare = "var "
                js.append("%s%s = %s.__getitem__(%d);" % (declare, var, dummy, i))
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Index):
            # found index assignment
            js = ["%s.__setitem__(%s, %s);" % (self.visit(target.value), self.visit(target.slice), value)]
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Slice):
            # found slice assignmnet
            js = ["%s.__setslice__(%s, %s, %s);" % (self.visit(target.value), self.visit(target.slice.lower), self.visit(target.slice.upper), value)]
        else:
            var = self.visit(target)
            if isinstance(target, ast.Name):
                if not (var in self._scope):
                    self._scope.append(var)
                    declare = "var "
                else:
                    declare = ""
                js = ["%s%s = %s;" % (declare, var, value)]
            elif isinstance(target, ast.Attribute):
                js = ["%s.__setattr__(\"%s\", %s);" % (self.visit(target.value), str(target.attr), value)]
            else:
                raise JSError("Unsupported assignment type")
        return js

    def visit_AugAssign(self, node):
        target = self.visit(node.target)
        value = self.visit(node.value)

        if not self.future_division and isinstance(node.op, ast.Div):
            node.op = ast.FloorDiv()

        if   isinstance(node.op, ast.Add     ): return self.visit_AssignSimple(node.target, "%s.__iadd__(%s)"      % (target, value))
        elif isinstance(node.op, ast.Sub     ): return self.visit_AssignSimple(node.target, "%s.__isub__(%s)"      % (target, value))
        elif isinstance(node.op, ast.Div     ): return self.visit_AssignSimple(node.target, "%s.__idiv__(%s)"      % (target, value))
        elif isinstance(node.op, ast.Mult    ): return self.visit_AssignSimple(node.target, "%s.__imul__(%s)"      % (target, value))
        elif isinstance(node.op, ast.LShift  ): return self.visit_AssignSimple(node.target, "%s.__ilshift__(%s)"   % (target, value))
        elif isinstance(node.op, ast.RShift  ): return self.visit_AssignSimple(node.target, "%s.__irshift__(%s)"   % (target, value))
        elif isinstance(node.op, ast.BitOr   ): return self.visit_AssignSimple(node.target, "%s.__ibitor__(%s)"    % (target, value))
        elif isinstance(node.op, ast.BitAnd  ): return self.visit_AssignSimple(node.target, "%s.__ibitand__(%s)"   % (target, value))
        elif isinstance(node.op, ast.BitXor  ): return self.visit_AssignSimple(node.target, "%s.__ibitxor__(%s)"   % (target, value))
        elif isinstance(node.op, ast.FloorDiv): return self.visit_AssignSimple(node.target, "%s.__ifloordiv__(%s)" % (target, value))
        elif isinstance(node.op, ast.Pow     ): return self.visit_AssignSimple(node.target, "%s.__ipow__(%s)"      % (target, value))
        else:
            raise JSError("Unsupported AugAssign type %s" % node.op)

    def visit_For(self, node):
        if isinstance(node.target, ast.Name):
            for_target = self.visit(node.target)
        elif isinstance(node.target, ast.Tuple):
            for_target = self.alloc_var()
        else:
            raise JSError("Advanced for-loop decomposition not supported")

        js = []

        for_iter = self.visit(node.iter)

        iter_dummy = self.alloc_var()
        orelse_dummy = self.alloc_var()
        exc_dummy = self.alloc_var()

        js.append("var %s = iter.__call__(%s);" % (iter_dummy, for_iter))
        js.append("var %s = false;" % orelse_dummy)
        js.append("while (1) {")
        if isinstance(node.target, ast.Name):
            js.append("    var %s;" % for_target)
        elif isinstance(node.target, ast.Tuple):
            js.append("    " + "; ".join(["var " + x.id for x in node.target.elts]))

        js.append("    try {")

        if isinstance(node.target, ast.Name):
            js.append("        %s = %s.next();" % (for_target, iter_dummy))
        elif isinstance(node.target, ast.Tuple):
            js.append("        %s = %s.next();" % (for_target, iter_dummy))
            js.append("    %s;" % "; ".join(["%s = %s.__getitem__(%s)" % (x.id, for_target, i) for i, x in enumerate(node.target.elts)]))
        js.append("    } catch (%s) {" % exc_dummy)
        js.append("        if (isinstance(%s, py_builtins.StopIteration)) {" % exc_dummy)
        js.append("            %s = true;" % orelse_dummy)
        js.append("            break;")
        js.append("        } else {")
        js.append("            throw %s;" % exc_dummy)
        js.append("        }")
        js.append("    }")

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        js.append("}")

        if node.orelse:
            js.append("if (%s) {" % orelse_dummy)

            for stmt in node.orelse:
                js.extend(self.indent(self.visit(stmt)))

            js.append("}")

        return js

    def visit_While(self, node):
        js = []

        if not node.orelse:
            js.append("while (js(%s)) {" % self.visit(node.test))
        else:
            orelse_dummy = self.alloc_var()

            js.append("var %s = false;" % orelse_dummy)
            js.append("while (1) {")
            js.append("    if (js(py_builtins.__not__(%s))) {" % self.visit(node.test))
            js.append("        %s = true;" % orelse_dummy)
            js.append("        break;")
            js.append("    }")

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        js.append("}")

        if node.orelse:
            js.append("if (%s) {" % orelse_dummy)

            for stmt in node.orelse:
                js.extend(self.indent(self.visit(stmt)))

            js.append("}")

        return js

    def visit_If(self, node):
        js = ["if (js(%s)) {" % self.visit(node.test)]

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        if node.orelse:
            js.append("} else {")

            for stmt in node.orelse:
                js.extend(self.indent(self.visit(stmt)))

        return js + ["}"]

    def _visit_With(self, node):
        pass

    def _visit_Raise(self, node):
        pass

    def visit_TryExcept(self, node):
        if node.orelse:
            raise JSError("Try-Except with else-clause not supported")

        js = []
        js.append("try {")
        for n in node.body:
            js.append("\n".join(self.visit(n)))
        err = self.alloc_var()
        self._exceptions.append(err)
        js.append("} catch (%s) {" % err)
        for i, n in enumerate(node.handlers):
            if i > 0:
                pre = "else "
            else:
                pre = ""
            if n.type:
                if isinstance(n.type, ast.Name):
                    js.append("%sif (isinstance(%s, %s)) {" % (pre, err, self.visit(n.type)))
                else:
                    raise JSError("Catching non-simple exceptions not supported")
            else:
                js.append("%sif (true) {" % (pre))

            if n.name:
                if isinstance(n.name, ast.Name):
                    js.append(self.indent(["var %s = %s;" % (self.visit(n.name), err)])[0])
                else:
                    raise JSError("Catching non-simple exceptions not supported")

            for b in n.body:
                js.extend(self.indent(self.visit(b)))

            js.append("}")

        js.append("};")
        self._exceptions.pop()
        return js

    def visit_TryFinally(self, node):
        js = []
        js.append("try {")
        for n in node.body:
            js.append("\n".join(self.visit(n)))           
        js.append("} catch (%s) { /* ignore */ }" % self.alloc_var())
        for n in node.finalbody:
            js.append("\n".join(self.visit(n)))
        return js

    def visit_Assert(self, node):
        test = self.visit(node.test)

        if node.msg is not None:
            return ["assert(%s, %s);" % (test, self.visit(node.msg))]
        else:
            return ["assert(%s);" % test]

    def _visit_Import(self, node):
        pass

    def visit_ImportFrom(self, node):
        if node.module == "__future__":
            if len(node.names) == 1 and node.names[0].name == "division":
                self.future_division = True
            else:
                raise JSError("Unknown import from __future__: %s" % node.names[0].name)
        else:
            raise JSError("Import only supports from __future__ import foo")
        return []

    def _visit_Exec(self, node):
        pass

    def visit_Global(self, node):
        self._scope.extend(node.names)
        return []

    def visit_Expr(self, node):
        return [self.visit(node.value) + ";"]

    def visit_Pass(self, node):
        return ["/* pass */"]

    def visit_Break(self, node):
        return ["break;"]

    def visit_Continue(self, node):
        return ["continue;"]

    def visit_arguments(self, node):
        return ", ".join([self.visit(arg) for arg in node.args])

    def visit_Lambda(self, node):
        return "Function(function(%s) {return %s;})" % (self.visit(node.args), self.visit(node.body))

    def visit_BoolOp(self, node):
        if isinstance(node.op, ast.And):
            return "%s.%s" % (self.visit(node.values[0]), ".".join(["__and__(%s)" % self.visit(val) for val in node.values[1:]]))
        if isinstance(node.op, ast.Or):
            return "%s.%s" % (self.visit(node.values[0]), ".".join(["__or__(%s)" % self.visit(val) for val in node.values[1:]]))
        else:
            raise JSError("Unknown boolean operation %s" % node.op)

    def visit_UnaryOp(self, node):
        if   isinstance(node.op, ast.USub  ): return "%s.__neg__()"            % (self.visit(node.operand))
        elif isinstance(node.op, ast.UAdd  ): return "%s.__pos__()"            % (self.visit(node.operand))
        elif isinstance(node.op, ast.Invert): return "%s.__invert__()"         % (self.visit(node.operand))
        elif isinstance(node.op, ast.Not   ): return "py_builtins.__not__(%s)" % (self.visit(node.operand))
        else:
            raise JSError("Unsupported unary op %s" % node.op)

    def visit_BinOp(self, node):
        if isinstance(node.op, ast.Mod) and isinstance(node.left, ast.Str):
            left = self.visit(node.left)
            if isinstance(node.right, (ast.Tuple, ast.List)):
                right = self.visit(node.right)
                return "vsprintf(js(%s), js(%s))" % (left, right)
            else:
                right = self.visit(node.right)
                return "sprintf(js(%s), %s)" % (left, right)
        left = self.visit(node.left)
        right = self.visit(node.right)

        if not self.future_division and isinstance(node.op, ast.Div):
            node.op = ast.FloorDiv()

        if   isinstance(node.op, ast.Add     ): return "%s.__add__(%s)"      % (left, right)
        elif isinstance(node.op, ast.Sub     ): return "%s.__sub__(%s)"      % (left, right)
        elif isinstance(node.op, ast.Div     ): return "%s.__div__(%s)"      % (left, right)
        elif isinstance(node.op, ast.Mod     ): return "%s.__mod__(%s)"      % (left, right)
        elif isinstance(node.op, ast.Pow     ): return "%s.__pow__(%s)"      % (left, right)
        elif isinstance(node.op, ast.Mult    ): return "%s.__mul__(%s)"      % (left, right)
        elif isinstance(node.op, ast.BitOr   ): return "%s.__bitor__(%s)"    % (left, right)
        elif isinstance(node.op, ast.BitAnd  ): return "%s.__bitand__(%s)"   % (left, right)
        elif isinstance(node.op, ast.BitXor  ): return "%s.__bitxor__(%s)"   % (left, right)
        elif isinstance(node.op, ast.LShift  ): return "%s.__lshift__(%s)"   % (left, right)
        elif isinstance(node.op, ast.RShift  ): return "%s.__rshift__(%s)"   % (left, right)
        elif isinstance(node.op, ast.FloorDiv): return "%s.__floordiv__(%s)" % (left, right)
        else:
            raise JSError("Unknown binary operation type %s" % node.op)

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]
        if   isinstance(op, ast.Eq   ): return "%s.__eq__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.NotEq): return "%s.__ne__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.Gt):    return "%s.__gt__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.Lt):    return "%s.__lt__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.GtE):   return "%s.__ge__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.LtE):   return "%s.__le__(%s)"              % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.In):    return "%s.__contains__(%s)"        % (self.visit(comp), self.visit(node.left))
        elif isinstance(op, ast.Is):    return "py_builtins.__is__(%s, %s)" % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.NotIn): return "py_builtins.__not__(%s.__contains__(%s))" % (self.visit(comp), self.visit(node.left))
        else:
            raise JSError("Unknown comparison type %s" % node.ops[0])

    def visit_Name(self, node):
        name = node.id
        try:
            name = self.name_map[name]
        except KeyError:
            pass

        if name in self.builtin and not name in self._scope:
            name = "py_builtins." + name

        return name

    def visit_Num(self, node):
        if isinstance(node.n, int):
            if (0 <= node.n <= 9):
                return "$c%s" % str(node.n)
            else:
                return "_int.__call__(%s)" % str(node.n)
        elif isinstance(node.n, float):
            return "_float.__call__(%s)" % node.n
        else:
            raise JSError("Unknown numeric type")

    def visit_Str(self, node):
        # Uses the Python builtin repr() of a string and the strip string type
        # from it. This is to ensure Javascriptness, even when they use things
        # like b"\\x00" or u"\\u0000".
        return "str.__call__(%s)" % repr(node.s).lstrip("urb")

    def visit_Call(self, node):
        js = []
        func = self.visit(node.func)

        if node.keywords:
            keywords = []
            for kw in node.keywords:
                keywords.append("%s: %s" % (kw.arg, self.visit(kw.value)))
            kwargs = "{" + ", ".join(keywords) + "}"
            js.append("%s.__kw_args = %s;" % (func, kwargs))

        js_args = ",".join([ self.visit(arg) for arg in node.args ])

        if isinstance(node.func, ast.Attribute):
            root = self.visit(node.func.value)
        else:
            root = func
        if js_args:
            js_args = ", " + js_args
        js.append("%s.__call__.call(%s%s)" % (func, root, js_args))
        return "\n".join(js)

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        if not node.type:
            return ["throw %s;" % self._exceptions[-1]]
        else:
            if isinstance(node.type, ast.Name):
                return ["throw %s.__call__();" % self.visit(node.type)]
            elif isinstance(node.type, ast.Call):
                return ["throw %s;" % self.visit(node.type)]
            else:
                raise JSError("Unknown exception type")

    def visit_Print(self, node):
        assert node.dest is None
        assert node.nl
        values = [self.visit(v) for v in node.values]
        values = ", ".join(values)
        return ["py_builtins.print(%s);" % values]

    def visit_Attribute(self, node):
        return """%s.__getattr__("%s")""" % (self.visit(node.value), node.attr)

    def visit_Tuple(self, node):
        els = [self.visit(e) for e in node.elts]
        return "tuple.__call__([%s])" % (", ".join(els))

    def visit_Dict(self, node):
        els = []
        for k, v in zip(node.keys, node.values):
            if isinstance(k, ast.Name):
                els.append('tuple.__call__(["%s", %s])' % (self.visit(k), self.visit(v)))
            else:
                els.append("tuple.__call__([%s, %s])" % (self.visit(k), self.visit(v)))
        return "dict.__call__(tuple.__call__([%s]))" % (",\n".join(els))

    def visit_List(self, node):
        els = [self.visit(e) for e in node.elts]
        return "list.__call__([%s])" % (", ".join(els))

    def visit_ListComp(self, node):
        if not len(node.generators) == 1:
            raise JSError("Compound list comprehension not supported")
        if not isinstance(node.generators[0].target, ast.Name):
            raise JSError("Non-simple targets in list comprehension not supported")

        return "map.__call__(function(%s) {return %s;}, %s)" % (node.generators[0].target.id, self.visit(node.elt), self.visit(node.generators[0].iter))

    def visit_GeneratorExp(self, node):
        if not len(node.generators) == 1:
            raise JSError("Compound generator expressions not supported")
        if not isinstance(node.generators[0].target, ast.Name):
            raise JSError("Non-simple targets in generator expressions not supported")

        return "map.__call__(function(%s) {return %s;}, %s)" % (node.generators[0].target.id, self.visit(node.elt), self.visit(node.generators[0].iter))

    def visit_Slice(self, node):
        if node.lower and node.upper and node.step:
            return "slice.__call__(%s, %s, %s)" % (self.visit(node.lower),
                    self.visit(node.upper), self.visit(node.step))
        if node.lower and node.upper:
            return "slice.__call__(%s, %s)" % (self.visit(node.lower),
                    self.visit(node.upper))
        if node.upper and not node.step:
            return "slice.__call__(%s)" % (self.visit(node.upper))
        if node.lower and not node.step:
            return "slice.__call__(%s, null)" % (self.visit(node.lower))
        if not node.lower and not node.upper and not node.step:
            return "slice.__call__(null)"
        raise NotImplementedError("Slice")

    def visit_Subscript(self, node):
        return "%s.__getitem__(%s)" % (self.visit(node.value), self.visit(node.slice))

    def visit_Index(self, node):
        return self.visit(node.value)

