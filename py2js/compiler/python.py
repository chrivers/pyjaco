######################################################################
##
## Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
## Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
## Copyright 2011 Christian Iversen <ci@sikkerhed.org>
##
## Permission is hereby granted, free of charge, to any person
## obtaining a copy of this software and associated documentation
## files (the "Software"), to deal in the Software without
## restriction, including without limitation the rights to use,
## copy, modify, merge, publish, distribute, sublicense, and/or sell
## copies of the Software, and to permit persons to whom the
## Software is furnished to do so, subject to the following
## conditions:
##
## The above copyright notice and this permission notice shall be
## included in all copies or substantial portions of the Software.
##
## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
## EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
## OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
## NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
## HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
## WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
## FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
## OTHER DEALINGS IN THE SOFTWARE.
##
######################################################################

import ast
import py2js.compiler
from py2js.compiler import JSError
from py2js.compiler.multiplexer import dump

class Compiler(py2js.compiler.BaseCompiler):

    obey_getattr_restriction = False

    ops_augassign = {
        "Add"     : "iadd",
        "Sub"     : "isub",
        "Div"     : "idiv",
        "Mult"    : "imul",
        "LShift"  : "ilshift",
        "RShift"  : "irshift",
        "BitOr"   : "ibitor",
        "BitAnd"  : "ibitand",
        "BitXor"  : "ibitxor",
        "FloorDiv": "ifloordiv",
        "Pow"     : "ipow",
    }

    ops_binop = {
        "Add": "add",
        "Sub": "sub",
        "Div": "div",
        "Mod": "mod",
        "Pow": "pow",
        "Mult": "mul",
        "BitOr": "bitor",
        "BitAnd": "bitand",
        "BitXor": "bitxor",
        "LShift": "lshift",
        "RShift": "rshift",
        "FloorDiv": "floordiv",
    }

    ops_compare = {
        "Eq": "eq",
        "NotEq": "ne",
        "Gt": "gt",
        "Lt": "lt",
        "GtE": "ge",
        "LtE": "le",
    }

    def __init__(self):
        super(Compiler, self).__init__()
        self.future_division = False

    def stack_destiny(self, names, skip):
        for name in reversed(self.stack[:-skip]):
            if name in names:
                return name
        else:
            return False

    def visit_Name(self, node):
        name = self.name_map.get(node.id, node.id)

        if (name in self.builtin) and not (name in self._scope):
            name = "py_builtins." + name

        return name

    def visit_Global(self, node):
        self._scope.extend(node.names)
        return []

    def visit_FunctionDef(self, node):
        js_defaults = []

        defaults = [None] * (len(node.args.args) - len(node.args.defaults)) + node.args.defaults

        if node.args.kwarg:
            kwarg_name = node.args.kwarg
        else:
            kwarg_name = "__kwargs"

        if len(node.args.args) and node.args.args[0].id == "self":
            offset = 1
        else:
            offset = 0

        for i, arg in enumerate(node.args.args[offset:]):
            if not isinstance(arg, ast.Name):
                raise JSError("tuples in argument list are not supported")

            if defaults[i+offset] == None:
                js_defaults.append("var %(id)s = %(kwarg)s.PY$get('%(id)s', arguments[%(i)d]);" % {"i": i, "id": arg.id, 'kwarg': kwarg_name })
            else:
                js_defaults.append("var %(id)s = arguments[%(i)d];" % {"i": i, "id": arg.id })
                js_defaults.append("if (typeof %(id)s === 'undefined') { %(id)s = %(kwarg)s.PY$get('%(id)s', %(def)s); };" % { 'id': arg.id, 'def': self.visit(defaults[i+offset]), 'kwarg': kwarg_name })

        if node.name in ["__getattr__", "__setattr__"]:
            js_defaults.append("if (typeof %(id)s === 'string') { %(id)s = str(%(id)s); };" % { 'id': node.args.args[1].id })

        self._scope = [arg.id for arg in node.args.args]

        inclass = self.stack_destiny(["ClassDef", "FunctionDef"], 2) in ["ClassDef"]

        if inclass:
            js = ["function() {"]
        else:
            js = ["var %s = function() {" % (node.name)]

        js.extend(self.indent(["var self = this; var %s = __kwargs_get(arguments);" % kwarg_name]))
        js.extend(self.indent(js_defaults))

        if node.args.vararg:
            l = len(node.args.args)
            if inclass:
                l -= 1
            js.extend(self.indent(["var %s = tuple(Array.prototype.slice.call(arguments, %s));" % (node.args.vararg, l)]))

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        self._scope = []
        js.append("}")

        for dec in node.decorator_list:
            js.extend(["%s.PY$%s = %s(%s.PY$__getattr__('%s'));" % (self.heirar, node.name, dec.id, self.heirar, node.name)])

        return js

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
        heirar = ".PY$".join(self._class_name + [])
        for stmt in node.body:
            if isinstance(stmt, ast.Assign):
                value = self.visit(stmt.value)
                for t in stmt.targets:
                    var = self.visit(t)
                    js.append("%s.PY$%s = %s;" % (heirar, var, value))
            elif isinstance(stmt, ast.FunctionDef):
                self.heirar = heirar
                js.append("%s.PY$%s = %s;" % (heirar, stmt.name, "\n".join(self.visit(stmt))))
            elif isinstance(stmt, ast.ClassDef):
                js.append("%s.PY$%s = %s;" % (heirar, stmt.name, "\n".join(self.visit(stmt))))
            elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Str):
                js.append("\n".join(["/* %s */" % s for s in stmt.value.s.split("\n")]))
            elif isinstance(stmt, ast.Pass):
                # Not required for js
                pass
            else:
                raise JSError("Unsupported class data: %s" % stmt)
        self._class_name.pop()

        return js

    def visit_Delete(self, node):
        return [self.visit_DeleteSimple(part) for part in node.targets]

    def visit_DeleteSimple(self, node):
        if isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Index):
            js = "%s.PY$__delitem__(%s);" % (self.visit(node.value), self.visit(node.slice))
        elif isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Slice):
            js = "%s.PY$__delslice__(%s, %s);" % (self.visit(node.value), self.visit(node.slice.lower), self.visit(node.slice.upper))
        elif isinstance(node, ast.Attribute):
            js = '%s.PY$__delattr__("%s");' % (self.visit(node.value), node.attr)
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
                js.append("%s%s = %s.PY$__getitem__(%d);" % (declare, var, dummy, i))
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Index):
            # found index assignment
            js = ["%s.PY$__setitem__(%s, %s);" % (self.visit(target.value), self.visit(target.slice), value)]
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Slice):
            # found slice assignmnet
            js = ["%s.PY$__setslice__(%s, %s, %s);" % (self.visit(target.value), self.visit(target.slice.lower), self.visit(target.slice.upper), value)]
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
                js = ['%s.PY$__setattr__("%s", %s);' % (self.visit(target.value), str(target.attr), value)]
            else:
                raise JSError("Unsupported assignment type")
        return js

    def visit_AugAssign(self, node):
        target = self.visit(node.target)
        value = self.visit(node.value)

        if not self.future_division and isinstance(node.op, ast.Div):
            node.op = ast.FloorDiv()

        name = node.op.__class__.__name__
        if name in self.ops_augassign:
            return self.visit_AssignSimple(node.target,
                "%s.PY$__%s__(%s)" % (target, self.ops_augassign[name], value))
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
        exc_dummy = self.alloc_var()

        js.append("try {")
        js.append("  var %s;" % for_target)
        for_init = "var %s = iter(%s)" % (iter_dummy, for_iter)
        for_iter = "%s = %s.PY$next()" % (for_target, iter_dummy)
        for_cond = ""
        js.append("  for (%s; %s; %s) {" % (for_init, for_iter, for_cond))
        if isinstance(node.target, ast.Tuple):
            js.append("    %s;" % "; ".join(["var %s = %s.PY$__getitem__(%s)" % (x.id, for_target, i) for i, x in enumerate(node.target.elts)]))

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        js.append("  }")

        js.append("} catch (%s) {" % exc_dummy)
        js.append("  if (!js(py_builtins.isinstance(%s, py_builtins.StopIteration)))" % exc_dummy)
        js.append("    throw %s;" % exc_dummy)
        if node.orelse:
            js.append("  else {")
            for stmt in node.orelse:
                js.extend(self.indent(self.visit(stmt)))
            js.append("  }")
        js.append("}")

        return js

    def visit_While(self, node):
        js = []

        if node.orelse:
            orelse_var = self.alloc_var()
            js.append("var %s = true;" % orelse_var)

        js.append("while (js(%s)) {" % self.visit(node.test))
        if node.orelse:
            js.extend(self.indent(["var %s = true;" % orelse_var]))

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        js.append("}")

        if node.orelse:
            js.append("if (%s) {" % orelse_var)

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

    def visit_TryExcept(self, node):
        if node.orelse:
            raise JSError("Try-Except with else-clause not supported")

        js = []
        js.append("try {")
        for n in node.body:
            js.extend(self.indent(self.visit(n)))
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
                    js.extend(self.indent(["%sif (js(py_builtins.isinstance(%s, %s))) {" % (pre, err, self.visit(n.type))]))
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
        exc_var = self.alloc_var()
        exc_store = self.alloc_var()
        js.append("var %s;" % exc_store)
        js.append("try {")
        for n in node.body:
            js.append("\n".join(self.visit(n)))
        js.append("} catch (%s) { %s = %s; }" % (exc_var, exc_store, exc_var))
        for n in node.finalbody:
            js.append("\n".join(self.visit(n)))
        js.append("if (%s) { throw %s; }" % (exc_store, exc_store))
        return js

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

    def visit_Lambda(self, node):
        node_args = self.visit(node.args)
        node_body = self.visit(node.body)
        return "function(%s) {return %s;}" % (node_args, node_body)

    def visit_BoolOp(self, node):
        assign = self.stack_destiny(["Assign", "FunctionDef", "Print", "Call"], 1) in ["Assign", "Print", "Call"]

        if isinstance(node.op, ast.And):
            op = " && "
        elif isinstance(node.op, ast.Or):
            op = " || "
        else:
            raise JSError("Unknown boolean operation %s" % node.op)

        if assign:
            var = self.alloc_var()
            return "function() { %s; return %s; }()" % (op.join(["js(%s = %s)" % (var, self.visit(val)) for val in node.values]), var)
        else:
            return op.join(["js(%s)" % self.visit(val) for val in node.values])

    def visit_UnaryOp(self, node):
        if   isinstance(node.op, ast.USub  ): return "%s.PY$__neg__()"            % (self.visit(node.operand))
        elif isinstance(node.op, ast.UAdd  ): return "%s.PY$__pos__()"            % (self.visit(node.operand))
        elif isinstance(node.op, ast.Invert): return "%s.PY$__invert__()"         % (self.visit(node.operand))
        elif isinstance(node.op, ast.Not   ): return "py_builtins.__not__(%s)" % (self.visit(node.operand))
        else:
            raise JSError("Unsupported unary op %s" % node.op)

    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)

        if isinstance(node.op, ast.Mod) and isinstance(node.left, ast.Str):
            return "%s.PY$__mod__(%s)" % (left, right)

        if not self.future_division and isinstance(node.op, ast.Div):
            node.op = ast.FloorDiv()

        name = node.op.__class__.__name__

        if name in self.ops_binop:
            return "%s.PY$__%s__(%s)" % (left, self.ops_binop[name], right)
        else:
            raise JSError("Unknown binary operation type %s" % node.op)

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]

        name = op.__class__.__name__

        if name in self.ops_compare:
            return "%s.PY$__%s__(%s)" % (self.visit(node.left), self.ops_compare[name], self.visit(comp))
        elif isinstance(op, ast.In):
            return "%s.PY$__contains__(%s)" % (self.visit(comp), self.visit(node.left))
        elif isinstance(op, ast.Is):
            return "py_builtins.__is__(%s, %s)" % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.NotIn):
            return "py_builtins.__not__(%s.PY$__contains__(%s))" % (self.visit(comp), self.visit(node.left))
        else:
            raise JSError("Unknown comparison type %s" % node.ops[0])

    def visit_Num(self, node):
        if isinstance(node.n, int):
            if (0 <= node.n <= 9):
                return "$c%s" % str(node.n)
            else:
                return "int(%s)" % str(node.n)
        elif isinstance(node.n, float):
            return "float(%s)" % node.n
        else:
            raise JSError("Unknown numeric type")

    def visit_Str(self, node):
        # Uses the Python builtin repr() of a string and the strip string type
        # from it. This is to ensure Javascriptness, even when they use things
        # like b"\\x00" or u"\\u0000".
        return "str(%s)" % repr(node.s).lstrip("urb")

    def visit_Call(self, node):
        js = []
        func = self.visit(node.func)
        compound = ("Assign" in self.stack) or ("AugAssign" in self.stack) or (self.stack.count("Call") > 1)

        if node.keywords:
            keywords = []
            for kw in node.keywords:
                keywords.append("%s: %s" % (kw.arg, self.visit(kw.value)))
            kwargs = ["__kwargs_make({%s})" % ", ".join(keywords)]
        else:
            kwargs = []

        js_args = ", ".join([ self.visit(arg) for arg in node.args ] + kwargs)

        js.append("%s(%s)" % (func, js_args))

        return "\n".join(js)

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        if not node.type:
            return ["throw %s;" % self._exceptions[-1]]
        else:
            if isinstance(node.type, ast.Name):
                return ["throw %s();" % self.visit(node.type)]
            elif isinstance(node.type, ast.Call):
                return ["throw %s;" % self.visit(node.type)]
            else:
                raise JSError("Unknown exception type")

    def visit_Attribute(self, node):
        if node.attr.startswith("__") and self.obey_getattr_restriction:
            return """%s.PY$%s""" % (self.visit(node.value), node.attr)
        else:
            return """%s.PY$__getattr__("%s")""" % (self.visit(node.value), node.attr)

    def visit_Tuple(self, node):
        els = [self.visit(e) for e in node.elts]
        return "tuple([%s])" % (", ".join(els))

    def visit_Dict(self, node):
        els = []
        for k, v in zip(node.keys, node.values):
            if isinstance(k, ast.Name):
                els.append('"%s", %s' % (self.visit(k), self.visit(v)))
            else:
                els.append("%s, %s" % (self.visit(k), self.visit(v)))
        return "dict([%s])" % (", ".join(els))

    def visit_List(self, node):
        els = [self.visit(e) for e in node.elts]
        return "list([%s])" % (", ".join(els))

    def visit_ListComp(self, node):
        if not len(node.generators) == 1:
            raise JSError("Compound list comprehension not supported")
        if isinstance(node.generators[0].target, ast.Name):
            prefix = ""
            name = node.generators[0].target.id
        elif isinstance(node.generators[0].target, ast.Tuple):
            name = self.alloc_var()
            prefix = "".join(["%s = %s.PY$__getitem__(%d); " % (k.id, name, i) for i, k in enumerate(node.generators[0].target.elts)])
        else:
            raise JSError("Non-simple targets in list comprehension not supported")

        body = self.visit(node.elt)
        iterexp = self.visit(node.generators[0].iter)
        return "py_builtins.map(function(%s) {%sreturn %s;}, %s)" % (name, prefix, body, iterexp)

    def visit_GeneratorExp(self, node):
        if not len(node.generators) == 1:
            raise JSError("Compound generator expressions not supported")
        if not isinstance(node.generators[0].target, ast.Name):
            raise JSError("Non-simple targets in generator expressions not supported")

        return "py_builtins.map(function(%s) {return %s;}, %s)" % (node.generators[0].target.id, self.visit(node.elt), self.visit(node.generators[0].iter))

    def visit_Slice(self, node):
        if node.lower and node.upper and node.step:
            return "slice(%s, %s, %s)" % (self.visit(node.lower),
                    self.visit(node.upper), self.visit(node.step))
        if node.lower and node.upper:
            return "slice(%s, %s)" % (self.visit(node.lower),
                    self.visit(node.upper))
        if node.upper and not node.step:
            return "slice(%s)" % (self.visit(node.upper))
        if node.lower and not node.step:
            return "slice(%s, null)" % (self.visit(node.lower))
        if not node.lower and not node.upper and not node.step:
            return "slice(null)"
        raise NotImplementedError("Slice")

    def visit_Subscript(self, node):
        return "%s.PY$__getitem__(%s)" % (self.visit(node.value), self.visit(node.slice))

    def visit_Index(self, node):
        return self.visit(node.value)
