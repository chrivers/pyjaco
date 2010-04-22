"""
module Python version "$Revision: 62047 $"
{
    mod = Module(stmt* body)
        | Interactive(stmt* body)
        | Expression(expr body)

    stmt = FunctionDef(identifier name, arguments args, stmt* body, expr* decorator_list)
          | ClassDef(identifier name, expr* bases, stmt* body, expr *decorator_list)
          | Return(expr? value)

          | Delete(expr* targets)
          | Assign(expr* targets, expr value)
          | AugAssign(expr target, operator op, expr value)

          | Print(expr? dest, expr* values, int nl)

          | For(expr target, expr iter, stmt* body, stmt* orelse)
          | While(expr test, stmt* body, stmt* orelse)
          | If(expr test, stmt* body, stmt* orelse)
          | With(expr context_expr, expr? optional_vars, stmt* body)

          | Raise(expr? type, expr? inst, expr? tback)
          | TryExcept(stmt* body, excepthandler* handlers, stmt* orelse)
          | TryFinally(stmt* body, stmt* finalbody)
          | Assert(expr test, expr? msg)

          | Import(alias* names)
          | ImportFrom(identifier module, alias* names, int? level)

          | Exec(expr body, expr? globals, expr? locals)

          | Global(identifier* names)
          | Expr(expr value)
          | Pass | Break | Continue

    expr = BoolOp(boolop op, expr* values)
         | BinOp(expr left, operator op, expr right)
         | UnaryOp(unaryop op, expr operand)
         | Lambda(arguments args, expr body)
         | IfExp(expr test, expr body, expr orelse)
         | Dict(expr* keys, expr* values)
         | ListComp(expr elt, comprehension* generators)
         | GeneratorExp(expr elt, comprehension* generators)
         | Yield(expr? value)
         | Compare(expr left, cmpop* ops, expr* comparators)
         | Call(expr func, expr* args, keyword* keywords, expr? starargs, expr? kwargs)
         | Repr(expr value)
         | Num(object n)
         | Str(string s)

         | Attribute(expr value, identifier attr, expr_context ctx)
         | Subscript(expr value, slice slice, expr_context ctx)
         | Name(identifier id, expr_context ctx)
         | List(expr* elts, expr_context ctx)
         | Tuple(expr* elts, expr_context ctx)

    expr_context = Load | Store | Del | AugLoad | AugStore | Param

    slice = Ellipsis
          | Slice(expr? lower, expr? upper, expr? step)
          | ExtSlice(slice* dims)
          | Index(expr value)

    boolop = And | Or

    operator = Add | Sub | Mult | Div | Mod | Pow | LShift | RShift | BitOr | BitXor | BitAnd | FloorDiv

    unaryop = Invert | Not | UAdd | USub

    cmpop = Eq | NotEq | Lt | LtE | Gt | GtE | Is | IsNot | In | NotIn

    comprehension = (expr target, expr iter, expr* ifs)

    excepthandler = ExceptHandler(expr? type, expr? name, stmt* body)

    arguments = (expr* args, identifier? vararg, identifier? kwarg, expr* defaults)
    keyword = (identifier arg, expr value)

    alias = (identifier name, identifier? asname)
}
"""

import ast

def scope(func):
    func.scope = True
    return func

class JSError(Exception):
    pass

class JS(object):

    name_map = {
        'self'   : 'this',
        'True'   : 'true',
        'False'  : 'false',
    }

    unary_op = {
        'Invert' : '~',
        'Not'    : '!',
        'UAdd'   : '+',
        'USub'   : '-',
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

    def __init__(self):
        self.dummy = 0
        self.classes = ['dict', 'list', 'tuple']

    def name(self, node):
        return node.__class__.__name__

    def get_unary_op(self, node):
        return self.unary_op[node.op.__class__.__name__]

    def get_binary_op(self, node):
        return self.binary_op[node.op.__class__.__name__]

    def visit(self, node, scope=None):
        try:
            visitor = getattr(self, 'visit_' + self.name(node))

            if hasattr(visitor, 'statement'):
                return visitor(node, scope)
            else:
                return visitor(node)
        except AttributeError:
            raise JSError("syntax not supported (%s)" % node)

    def indent(self, stmts):
        return [ "    " + stmt for stmt in stmts ]

    def visit_Module(self, node):
        module = []

        for stmt in node.body:
            module.extend(self.visit(stmt))

        return module

    @scope
    def visit_FunctionDef(self, node):
        if node.args.vararg is not None:
            raise JSError("star arguments are not supported")

        if node.args.kwarg is not None:
            raise JSError("keyword arguments are not supported")

        if node.decorator_list:
            raise JSError("decorators are not supported")

        defaults = [None]*(len(node.args.args) - len(node.args.defaults)) + node.args.defaults

        js_args = []
        js_defaults = []

        for arg, default in zip(node.args.args, defaults):
            if not isinstance(arg, ast.Name):
                raise JSError("tuples in argument list are not supported")

            js_args.append(arg.id)

            if default is not None:
                js_defaults.append("%(id)s = typeof(%(id)s) != 'undefined' ? %(id)s : %(def)s;\n" % { 'id': arg.id, 'def': self.visit(default) })

        js = [("function %s(" % node.name) + ", ".join(js_args) + ") {"]

        js.extend(self.indent(js_defaults))

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        return js + ["}"]

    @scope
    def _visit_ClassDef(self, node):
        pass

    def visit_Return(self, node):
        if node.value is not None:
            return ["return %s;" % self.visit(node.value)]
        else:
            return ["return;"]

    def visit_Delete(self, node):
        return node

    @scope
    def visit_Assign(self, node):
        targets = map(self.visit, node.targets)
        value = self.visit(node.value)

        if len(targets) == 1:
            js = ["%s = %s;" % (targets[0], value)]
        else:
            js = ["var __dummy%d__ = %s;" % (self.dummy, node.value)]

            for i, target in enumerate(targers):
                js.append("%s = __dummy%d__[%d];" % (target, self.dummy, i))

            self.dummy += 1

        return js

    def visit_AugAssign(self, node):
        target = self.visit(node.target)
        value = self.visit(node.value)

        if isinstance(node.op, ast.Pow):
            return ["%s = Math.pow(%s, %s);" % (target, target, value)]
        if isinstance(node.op, ast.FloorDiv):
            return ["%s = Math.floor((%s)/(%s));" % (target, target, value)]

        return ["%s %s= %s;" % (target, self.get_binary_op(node), value)]

    def _visit_Print(self, node):
        pass

    @scope
    def _visit_For(self, node):
        js = ["for (%s) {" % self.visit(node.test)]

        if node.orelse:
            raise JSError("'else' in 'for' loop not supported")

    @scope
    def visit_While(self, node):
        js = ["while (%s) {" % self.visit(node.test)]

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        if node.orelse:
            raise JSError("'else' in 'while' loop not supported")

        return js + ["}"]

    @scope
    def visit_If(self, node):
        js = ["if (%s) {" % self.visit(node.test)]

        for stmt in node.body:
            js.extend(self.indent(self.visit(stmt)))

        if node.orelse:
            js.append("} else {")

            for stmt in node.orelse:
                js.extend(self.indent(self.visit(stmt)))

        return js + ["}"]

    @scope
    def _visit_With(self, node):
        pass

    @scope
    def _visit_Raise(self, node):
        pass

    @scope
    def _visit_TryExcept(self, node):
        pass

    @scope
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

    def _visit_Global(self, node):
        pass

    def visit_Expr(self, node):
        return [self.visit(node.value) + ";"]

    def visit_Pass(self, node):
        return ["/* pass */"]

    def visit_Break(self, node):
        return ["break;"]

    def visit_Continue(self, node):
        return ["continue;"]

    def visit_UnaryOp(self, node):
        return "%s(%s)" % (self.get_unary_op(node), self.visit(node.operand))

    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)

        if isinstance(node.op, ast.Pow):
            return "Math.pow(%s, %s)" % (left, right)
        if isinstance(node.op, ast.FloorDiv):
            return "Math.floor((%s)/(%s))" % (left, right)

        return "(%s)%s(%s))" % (left, self.get_binary_op(node), right)

    def visit_Name(self, node):
        try:
            return self.name_map[node.id]
        except KeyError:
            return node.id

    def visit_Num(self, node):
        return str(node.n)

    def visit_Str(self, node):
        return '"%s"' % node.s

    def visit_Call(self, node):
        if node.keywords:
            raise JSError("only positional arguments supported")

        if node.starargs is not None:
            raise JSError("star arguments are not supported")

        if node.kwargs is not None:
            raise JSError("keyword arguments are not supported")

        js_args = ",".join([ self.visit(arg) for arg in node.args ])

        return "%s(%s)" % (self.visit(node.func), js_args)

js = JS()

from ast import parse, dump # XXX: for debugging

t1 = """\
for x in xrange(0, 1):
    x
else:
    pass
"""

t2 = """\
if x:
    pass
else:
    pass
"""

t3 = """\
def f(y):
    x = y

    while x:
        x -= 1

    return True
"""

t4 = """\

"""

t5 = """\

"""

t6 = """\

"""

t7 = """\

"""

t8 = """\

"""

