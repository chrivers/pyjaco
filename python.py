import inspect
from ast import parse, iter_fields, AST, dump, NodeVisitor

class PythonVisitor(NodeVisitor):
    """
    Visits the python AST tree and transform it to Python.

    The visit(node) method returns either a string if the node is an
    expression, otherwise a list of strings if node is a list of statements
    (lines).
    """

    def __init__(self):
        self._scope = []

    def visit_block(self, l):
        s = []
        for statement in l:
            v = self.visit(statement)
            if isinstance(v, str):
                # just an expression
                s.append(v)
            else:
                s.extend(v)
        return s

    def indent(self, l):
        s = []
        for item in l:
            s.append("    %s" % item)
        return s

    def visit_block_and_indent(self, l):
        return self.indent(self.visit_block(l))

    def visit_If(self, node):
        s = []
        s.append("if %s:" % self.visit(node.test))
        s.extend(self.visit_block_and_indent(node.body))
        if len(node.orelse) > 0:
            s.append("else:")
            s.extend(self.visit_block_and_indent(node.orelse))
        return s

    def visit_Assign(self, node):
        assert len(node.targets) == 1
        target = node.targets[0]
        return ["%s = %s" % (self.visit(target), self.visit(node.value))]

    def visit_AugAssign(self, node):
        return ["%s %s= %s" % (self.visit(node.target),
            self.visit(node.op),
            self.visit(node.value))]

    def visit_Num(self, node):
        return str(node.n)

    def visit_Lt(self, node):
        return ">"

    def visit_Gt(self, node):
        return ">"

    def visit_Or(self, node):
        return "or"

    def visit_And(self, node):
        return "and"

    def visit_Not(self, node):
        return "not"

    def visit_Eq(self, node):
        return "=="

    def visit_NotEq(self, node):
        return "!="

    def visit_Add(self, node):
        return "+"

    def visit_Sub(self, node):
        return "-"

    def visit_Mult(self, node):
        return "*"

    def visit_Div(self, node):
        return "/"

    def visit_arguments(self, node):
        return [self.visit(arg) for arg in node.args]

    def visit_Return(self, node):
        return ["return %s" % self.visit(node.value)]

    def visit_FunctionDef(self, node):
        s = []
        args = ", ".join(self.visit(node.args))
        s.append("def %s(%s):" % (node.name, args))
        s.extend(self.visit_block_and_indent(node.body))
        return s

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]
        return "%s %s %s" % (self.visit(node.left),
                self.visit(op),
                self.visit(comp)
                )

    def visit_UnaryOp(self, node):
        return "%s %s" % (self.visit(node.op),
                self.visit(node.operand)
                )

    def visit_BinOp(self, node):
        return "%s %s %s" % (self.visit(node.left),
                self.visit(node.op),
                self.visit(node.right)
                )

    def visit_Module(self, node):
        return self.visit_block(node.body)

    def visit_Name(self, node):
        return node.id

    def visit_Call(self, node):
        assert len(node.keywords) == 0
        assert node.starargs is None
        assert node.kwargs is None
        args = [self.visit(x) for x in node.args]
        return "%s(%s)" % (self.visit(node.func), ", ".join(args))

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        return "raise %s" % self.visit(node.type)

    def visit_Expr(self, node):
        return self.visit(node.value)

    def visit_Str(self, node):
        if node.s.find("\n") == -1:
            return '"%s"' % node.s
        else:
            return '"""%s"""' % node.s

    def visit_Attribute(self, node):
        return "%s.%s" % (self.visit(node.value), node.attr)

    def visit_Tuple(self, node):
        els = [self.visit(e) for e in node.elts]
        return "(%s)" % (", ".join(els))

    def visit_List(self, node):
        els = [self.visit(e) for e in node.elts]
        return "[%s]" % (", ".join(els))

    def visit_Slice(self, node):
        if node.lower is None and node.upper is None and node.step is None:
            return ":"
        else:
            raise NotImplementedError("Slice")

    def visit_Subscript(self, node):
        return "%s[%s]" % (self.visit(node.value), self.visit(node.slice))

    def visit_Index(self, node):
        return self.visit(node.value)

    def visit_BoolOp(self, node):
        op = " %s " % self.visit(node.op)
        values = ["(%s)" % self.visit(v) for v in node.values]
        return op.join(values)

    def visit_For(self, node):
        assert len(node.orelse) == 0
        target = self.visit(node.target)
        iter = self.visit(node.iter)
        s = ["for %s in %s:" % (target, iter)]
        s.extend(self.visit_block_and_indent(node.body))
        return s

    def visit_While(self, node):
        assert len(node.orelse) == 0
        s = ["while %s:" % (self.visit(node.test))]
        s.extend(self.visit_block_and_indent(node.body))
        return s

    def generic_visit(self, node):
        def _f(x):
            if x is None:
                return "None"
            elif isinstance(x, str):
                return x
            elif isinstance(x, list):
                return [_f(y) for y in x]
            else:
                return self.visit(x)
        args = ', '.join(('%s=%s' % (a, _f(b)) for a, b in iter_fields(node)))
        rv = '%s(%s)' % (node.__class__.__name__, args)
        print "Generic visit:", rv
        return [rv]

def transform_py(s):
    v = PythonVisitor()
    t = parse(s)
    return "\n".join(v.visit(t))

class Python(object):

    def __init__(self, obj):
        obj_source = inspect.getsource(obj)
        self._python = transform_py(obj_source)

    def __str__(self):
        return self._python
