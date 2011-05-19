import py2js
import py2js.compiler
import ast
import inspect
from py2js.compiler import JSError

class Compiler(py2js.compiler.BaseCompiler):

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

        # XXX: disable $def for now, because it doesn't work in IE:
        if self._class_name:
        #if 1:
            if node.args.vararg is not None:
                raise JSError("star arguments are not supported")

            if node.args.kwarg is not None:
                raise JSError("keyword arguments are not supported")

            if node.decorator_list and not is_static and not is_javascript:
                raise JSError("decorators are not supported")

            defaults = [None]*(len(node.args.args) - len(node.args.defaults)) + node.args.defaults

            js_args = []
            js_defaults = []
            self._scope = [arg.id for arg in node.args.args]

            for arg, default in zip(node.args.args, defaults):
                if not isinstance(arg, ast.Name):
                    raise JSError("tuples in argument list are not supported")

                js_args.append(arg.id)

                if default is not None:
                    js_defaults.append("%(id)s = typeof(%(id)s) != 'undefined' ? %(id)s : %(def)s;\n" % { 'id': arg.id, 'def': self.visit(default) })

            if not is_static:
                if not (js_args[0] == "self"):
                    raise NotImplementedError("The first argument must be 'self'.")
                del js_args[0]

            js = ["Function(function %s(%s) {" % (node.name, ", ".join(js_args))]

            js.extend(self.indent(js_defaults))

            for stmt in node.body:
                js.extend(self.indent(self.visit(stmt)))

            js.append('})')

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
            return js
        else:
            defaults = [None]*(len(node.args.args) - len(node.args.defaults)) + node.args.defaults

            js_args = []
            js_defaults = []
            self._scope = [arg.id for arg in node.args.args]

            for arg, default in zip(node.args.args, defaults):
                if not isinstance(arg, ast.Name):
                    raise JSError("tuples in argument list are not supported")

                js_args.append(arg.id)

                if default is not None:
                    js_defaults.append("%(id)s = typeof(%(id)s) != 'undefined' ? %(id)s : %(def)s;" % { 'id': arg.id, 'def': self.visit(default) })

            args = ", ".join(js_args)
            js = ["var %s = Function(function(%s) {" % (node.name, args)]
            self._scope = [arg.id for arg in node.args.args]
            for stmt in node.body:
                js.extend(self.indent(self.visit(stmt)))
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
            js.append("__inherit(%s);" % bases[0]);
        else:
            js.append("var %s = __inherit(%s);" % (class_name, bases[0]));

        #~ methods = []
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

        #The following is unnecessary: __init__ is inherited from
        #'object'
        #~ methods_names = [m.name for m in methods]
        #~ if not "__init__" in methods_names:
            #~ # if the user didn't define __init__(), we have to add it ourselves
            #~ # because we call it from the constructor above
            #~ js.append("_%s.prototype.__init__ = function() {" % class_name)
            #~ js.append("}")

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
        else:
            raise JSError("Unsupported delete type: %s" % node)

        return js

    def visit_AssignSimple(self, target, value):
        if isinstance(target, (ast.Tuple, ast.List)):
            dummy = self.new_dummy()
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
        # TODO: Make sure that all the logic in Assign also works in AugAssign
        target = self.visit(node.target)
        value = self.visit(node.value)

        if isinstance(node.target, ast.Name):
            return ["%s %s= %s" % (self.visit(node.target), self.get_binary_op(node), value)]
        else:
            js = []
            base = self.new_dummy()
            dummy = self.new_dummy()
            if isinstance(node.op, ast.Pow):
                js.append("%s = Math.pow(%s, %s);" % (dummy, target, value))
            elif isinstance(node.op, ast.FloorDiv):
                js.append("%s = Math.floor((%s)/(%s));" % (dummy, target, value))
            else:
                js.append("%s = %s %s %s" % (dummy, self.visit(node.target), self.get_binary_op(node), value))
            return js + self.visit_AssignSimple(node.target, dummy)

    def visit_For(self, node):
        if not isinstance(node.target, ast.Name):
            raise JSError("argument decomposition in 'for' loop is not supported")

        js = []

        for_target = self.visit(node.target)
        for_iter = self.visit(node.iter)

        iter_dummy = self.new_dummy()
        orelse_dummy = self.new_dummy()
        exc_dummy = self.new_dummy()

        js.append("var %s = iter.__call__(%s);" % (iter_dummy, for_iter))
        js.append("var %s = false;" % orelse_dummy)
        js.append("while (1) {")
        js.append("    var %s;" % for_target)
        js.append("    try {")
        js.append("        %s = %s.next();" % (for_target, iter_dummy))
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
            js.append("while (%s) {" % self.visit(node.test))
        else:
            orelse_dummy = self.new_dummy()

            js.append("var %s = false;" % orelse_dummy)
            js.append("while (1) {");
            js.append("    if (!(%s)) {" % self.visit(node.test))
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
        js = ["if (py_builtins.bool(%s)) {" % self.visit(node.test)]

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

    def _visit_TryExcept(self, node):
        pass

    def _visit_TryFinally(self, node):
        pass

    def visit_Assert(self, node):
        test = self.visit(node.test)

        if node.msg is not None:
            return ["assert(%s, %s);" % (test, self.visit(node.msg))]
        else:
            return ["assert(%s);" % test]

    def _visit_Import(self, node):
        pass

    def _visit_ImportFrom(self, node):
        pass

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
        return "function(%s) {%s}" % (self.visit(node.args), self.visit(node.body))

    def visit_BoolOp(self, node):
        return self.get_bool_op(node).join([ "(%s)" % self.visit(val) for val in node.values ])

    def visit_UnaryOp(self, node):
        return "%s(%s)" % (self.get_unary_op(node), self.visit(node.operand))

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

        if isinstance(node.op, ast.Pow):
            return "Math.pow(%s, %s)" % (left, right)
        if isinstance(node.op, ast.FloorDiv):
            return "Math.floor((%s)/(%s))" % (left, right)

        return "(%s)%s(%s)" % (left, self.get_binary_op(node), right)

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]
        if isinstance(op, ast.In):
            return "%s.__contains__(%s)" % (
                    self.visit(comp),
                    self.visit(node.left),
                    )
        elif isinstance(op, ast.NotIn):
            return "!(%s.__contains__(%s))" % (
                    self.visit(comp),
                    self.visit(node.left),
                    )
        elif isinstance(op, ast.Eq):
            return "py_builtins.eq(%s, %s)" % (
                    self.visit(node.left),
                    self.visit(comp),
                    )
        elif isinstance(op, ast.NotEq):
            #In fact, we'll have to override this too:
            return "!(py_builtins.eq(%s, %s))" % (
                    self.visit(node.left),
                    self.visit(comp),
                    )
        else:
            return "%s %s %s" % (self.visit(node.left),
                    self.get_comparison_op(op),
                    self.visit(comp)
                    )

    def visit_Name(self, node):
        id = node.id
        try:
            id = self.name_map[id]
        except KeyError:
            pass

        if id in self.builtin:
            id = "py_builtins." + id;

        #~ if id in self._classes:
            #~ id = '_' + id;

        return id

    def visit_Num(self, node):
        return str(node.n)

    def visit_Str(self, node):
        # Uses the Python builtin repr() of a string and the strip string type
        # from it. This is to ensure Javascriptness, even when they use things
        # like b"\\x00" or u"\\u0000".
        return "str.__call__(%s)" % repr(node.s).lstrip("urb")

    def visit_Call(self, node):
        func = self.visit(node.func)
        if node.keywords:
            keywords = []
            for kw in node.keywords:
                keywords.append("%s: %s" % (kw.arg, self.visit(kw.value)))
            keywords = "{" + ", ".join(keywords) + "}"
            js_args = ",".join([ self.visit(arg) for arg in node.args ])
            return "%s.args([%s], %s)" % (func, js_args,
                    keywords)
        else:
            if node.starargs is not None:
                raise JSError("star arguments are not supported")

            if node.kwargs is not None:
                raise JSError("keyword arguments are not supported")

            js_args = ",".join([ self.visit(arg) for arg in node.args ])

            if isinstance(node.func, ast.Attribute):
                root = self.visit(node.func.value)
            else:
                root = func
            if js_args:
                js_args = ", " + js_args
            return "%s.__call__.call(%s%s)" % (func, root, js_args)

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        return ["throw %s;" % self.visit(node.type)]

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

