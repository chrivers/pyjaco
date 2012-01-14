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

import pyjaco.compiler
import ast
from pyjaco.compiler import JSError

class Compiler(pyjaco.compiler.BaseCompiler):

    unary_op = {
        'Invert' : '~',
        'Not'    : '!',
        'UAdd'   : '+',
        'USub'   : '-',
    }

    bool_op = {
        'And'    : '&&',
        'Or'     : '||',
    }

    binary_op = {
        'Add'    : '+',
        'Sub'    : '-',
        'Mult'   : '*',
        'Div'    : '/',
        'Mod'    : '%',
        'LShift' : '<<',
        'RShift' : '>>',
        'BitOr'  : '|',
        'BitXor' : '^',
        'BitAnd' : '&',
    }

    comparison_op = {
            'Eq'    : "==",
            'NotEq' : "!=",
            'Lt'    : "<",
            'LtE'   : "<=",
            'Gt'    : ">",
            'GtE'   : ">=",
            'Is'    : "===",
            'IsNot' : "is not", # Not implemented yet
    }

    def __init__(self, opts):
        super(Compiler, self).__init__(opts)
        self.name_map = self.name_map.copy()
        self.name_map.update({"True": "true", "False": "false", "None": "null"})
        self.opts = opts

    def get_bool_op(self, node):
        return self.bool_op[node.op.__class__.__name__]

    def get_unary_op(self, node):
        return self.unary_op[node.op.__class__.__name__]

    def get_binary_op(self, node):
        return self.binary_op[node.op.__class__.__name__]

    def get_comparison_op(self, node):
        return self.comparison_op[node.__class__.__name__]

    def visit_Name(self, node):
        name = self.name_map.get(node.id, node.id)

        if (name in self.builtin) and not (name in self._scope):
            name = "__builtins__." + name

        return name

    def visit_Global(self, node):
        self._scope.extend(node.names)
        return []

    def visit_FunctionDef(self, node):
        raise JSError("Javascript compiler does not support function definitions")

    def visit_ClassDef(self, node):
        raise JSError("Javascript compiler does not support class definitions")

    def visit_Delete(self, node):
        return ["delete %s;" % ", ".join([self.visit(x) for x in node.targets])]

    def visit_AssignSimple(self, left, right):
        target = left
        value  = right
        if isinstance(target, (ast.Tuple, ast.List)):
            part = self.alloc_var()
            js = ["var %s = %s;" % (part, value)]

            for i, target in enumerate(target.elts):
                var = self.visit(target)
                declare = ""
                if isinstance(target, ast.Name):
                    if not (var in self._scope):
                        self._scope.append(var)
                        declare = "var "
                js.append("%s%s = %s[%d];" % (declare, var, part, i))
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Index):
            # found index assignment
            if isinstance(target.slice, ast.Str):
                i = self.visit(target.slice)
            else:
                i = '"%s"' % self.visit(target.slice)
            js = ["%s[%s] = %s;" % (self.visit(target.value), self.visit(target.slice), value)]
        elif isinstance(target, ast.Subscript) and isinstance(target.slice, ast.Slice):
            raise JSError("Javascript does not support slice assignments")
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
                js = ["%s.%s = %s;" % (self.visit(target.value), str(target.attr), value)]
            else:
                raise JSError("Unsupported assignment type")
        return js

    def visit_AugAssign(self, node):
        target = self.visit(node.target)
        value = self.visit(node.value)

        if isinstance(node.op, ast.Pow):
            return ["%s = Math.pow(%s, %s);" % (target, target, value)]
        if isinstance(node.op, ast.FloorDiv):
            return ["%s = Math.floor((%s)/(%s));" % (target, target, value)]

        return ["%s %s= %s;" % (target, self.get_binary_op(node), value)]

    def visit_For(self, node):
        if not isinstance(node.target, ast.Name):
            raise JSError("argument decomposition in 'for' loop is not supported")

        js = []

        for_target = self.visit(node.target)
        for_iter = self.visit(node.iter)

        iter_dummy = self.alloc_var()
        orelse_dummy = self.alloc_var()
        exc_dummy = self.alloc_var()

        if isinstance(node.iter, ast.Call) and isinstance(node.iter.func, ast.Name) and node.iter.func.id == "range" and not node.orelse:
            counter  = self.visit(node.target)
            end_var  = self.alloc_var()
            assert(len(node.iter.args) in (1,2,3))
            if len(node.iter.args) == 1:
                start = "0"
                end   = self.visit(node.iter.args[0])
                step  = "1"
            elif len(node.iter.args) == 2:
                start = self.visit(node.iter.args[0])
                end   = self.visit(node.iter.args[1])
                step  = "1"
            else:
                start = self.visit(node.iter.args[0])
                end   = self.visit(node.iter.args[1])
                step  = self.visit(node.iter.args[2])

            js.append("for (%s = %s; %s < %s; %s += %s) {" % (counter, start, counter, end, counter, step))
            for stmt in node.body:
                js.extend(self.indent(self.visit(stmt)))
            js.append("}")
            return js

        js.append("var %s = iter(%s);" % (iter_dummy, for_iter))
        js.append("var %s = false;" % orelse_dummy)
        js.append("while (1) {")
        js.append("    var %s;" % for_target)
        js.append("    try {")
        js.append("        %s = %s.PY$next();" % (for_target, iter_dummy))
        js.append("    } catch (%s) {" % exc_dummy)
        js.append("        if (__builtins__.isinstance(%s, __builtins__.StopIteration)) {" % exc_dummy)
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
            orelse_dummy = self.alloc_var()

            js.append("var %s = false;" % orelse_dummy)
            js.append("while (1) {")
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
        js = ["if (%s) {" % self.visit(node.test)]

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

    def _visit_Import(self, node):
        pass

    def _visit_ImportFrom(self, node):
        pass

    def visit_Lambda(self, node):
        return "\n    function(%s) {%s}" % (self.visit(node.args), self.visit(node.body))

    def visit_BoolOp(self, node):
        return self.get_bool_op(node).join([ "(%s)" % self.visit(val) for val in node.values ])

    def visit_UnaryOp(self, node):
        return "%s(%s)" % (self.get_unary_op(node), self.visit(node.operand))

    def visit_BinOp(self, node):
        if isinstance(node.op, ast.Mod) and isinstance(node.left, ast.Str):
            left = self.visit(node.left)
            if isinstance(node.right, (ast.Tuple, ast.List)):
                right = self.visit(node.right)
                return "sprintf(str(%s), tuple(%s))" % (left, right)
            else:
                right = self.visit(node.right)
                return "sprintf(str(%s), str(%s))" % (left, right)
        left = self.visit(node.left)
        right = self.visit(node.right)

        if isinstance(node.op, ast.Pow):
            return "Math.pow(%s, %s)" % (left, right)
        if isinstance(node.op, ast.FloorDiv):
            return "Math.floor((%s)/(%s))" % (left, right)

        return "(%s) %s (%s)" % (left, self.get_binary_op(node), right)

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]
        if isinstance(op, ast.In):
            return "%s.__contains__(%s)" % (self.visit(comp), self.visit(node.left))
        elif isinstance(op, ast.NotIn):
            return "!(%s.__contains__(%s))" % (self.visit(comp), self.visit(node.left))
        elif isinstance(op, ast.Eq):
            return "(%s) === (%s)" % (self.visit(node.left), self.visit(comp))
        elif isinstance(op, ast.NotEq):
            return "(%s) !== (%s)" % (self.visit(node.left), self.visit(comp))
        else:
            return "%s %s %s" % (self.visit(node.left), self.get_comparison_op(op), self.visit(comp))

    def visit_Num(self, node):
        return str(node.n)

    def visit_Str(self, node):
        # Uses the Python builtin repr() of a string and the strip string type
        # from it. This is to ensure Javascriptness, even when they use things
        # like b"\\x00" or u"\\u0000".
        return '"%s"' % repr(node.s).lstrip("urb")[1:-1]

    def visit_Call(self, node):
        func = self.visit(node.func)

        if node.keywords:
            keywords = []
            for kw in node.keywords:
                keywords.append("%s: %s" % (kw.arg, self.visit(kw.value)))
            keywords = "{" + ", ".join(keywords) + "}"
            js_args = ", ".join([ self.visit(arg) for arg in node.args ])
            return "%s.args([%s], %s)" % (func, js_args,
                    keywords)
        else:
            if node.starargs is not None:
                raise JSError("star arguments are not supported")

            if node.kwargs is not None:
                raise JSError("keyword arguments are not supported")

            js_args = ", ".join([ self.visit(arg) for arg in node.args ])

            return "%s(%s)" % (func, js_args)

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        return ["throw %s;" % self.visit(node.type)]

    def visit_Attribute(self, node):
        return "%s.%s" % (self.visit(node.value), node.attr)

    def visit_Tuple(self, node):
        els = [self.visit(e) for e in node.elts]
        return "[%s]" % (", ".join(els))

    def visit_Dict(self, node):
        els = []
        for k, v in zip(node.keys, node.values):
            els.append("%s: %s" % (self.visit(k), self.visit(v)))
        return "{%s}" % (", ".join(els))

    def visit_List(self, node):
        els = [self.visit(e) for e in node.elts]
        return "[%s]" % (", ".join(els))

    def visit_Slice(self, node):
        if node.step:
            raise JSError("Javascript does not support slicing in steps")

        if node.lower and node.upper:
            return ".slice(%s, %s)" % (self.visit(node.lower), self.visit(node.upper))

        if node.lower:
            return "[%s]" % (self.visit(node.lower))

        if node.upper:
            return ".slice(0, %s)" % (self.visit(node.upper))

        raise NotImplementedError("Slice")

    def visit_Subscript(self, node):
#        print node.value, node.slice
        if isinstance(node.slice, ast.Index):
            return "%s[%s]" % (self.visit(node.value), self.visit(node.slice))
        else:
            return "%s%s" % (self.visit(node.value), self.visit(node.slice))

    def visit_Index(self, node):
        return self.visit(node.value)

