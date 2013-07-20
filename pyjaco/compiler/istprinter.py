import ist
import istcompiler

class Printer(istcompiler.Multiplexer):

    indentation = 4

    opmap = dict(
        Add = "+",
        Sub = "-",
        Mult = "*",
        Div = "/",
        Mod = "%",
        BitAnd = "&",
        BitOr = "|",
        BitXor = "^",
        LShift = "<<",
        RShift = ">>",
        FloorDiv = "//",
        Pow      = "**",
        ## Non-aug ops
        And      = "and"
        )

    compmap = dict(
        Gt = ">",
        Eq = "=="
        )

    def indent(self, s, indentation = None):
        if indentation == None:
            indentation = self.indentation
        ind = " " * indentation
        if isinstance(s, list):
            return [ind + n for n in s]
        else:
            return ind + s

    def comp(self, node, indent = 0):
        if isinstance(node, list):
            # print "Visiting a list %s" % repr(node)
            return [self.comp(n) for n in node]
        else:
            # print "Visiting %s with fields [%s]" % (node.__class__.__name__, ", ".join(node._fields))
            return super(Printer, self).comp(node)

    def node_block(self, node):
        return "\n".join(self.comp(stmt) for stmt in node.body)

    def node_getattr(self, node):
        if isinstance(node.base, ist.Name) and node.base.id == "__builtins__":
            return node.attr
        else:
            return "%s.%s" % (self.comp(node.base), node.attr)

    def node_value(self, node):
        return self.comp(node.value)

    def node_int(self, node):
        return "%s" % node

    def node_num(self, node):
        return "%s" % node.value

    def node_binop(self, node):
        if node.op not in self.opmap:
            raise NotImplementedError(node.op)
        return "(%s %s %s)" % (self.comp(node.left), self.opmap[node.op], self.comp(node.right))

    def node_string(self, node):
        return '"%s"' % node.value

    def node_call(self, node):
        return "%s(%s)" % (self.comp(node.func), ", ".join(self.comp(node.params)))

    def node_name(self, node):
        return node.id

    def node_return(self, node):
        return "return %s" % self.comp(node.expr)

    def node_nop(self, node):
        return "pass"

    def node_function(self, node):
        if node.body == []:
            body = self.indent("pass")
        else:
            body = "\n".join(self.indent(self.comp(node.body)))
        return "def %s(%s):\n%s\n" % (node.name, self.comp(node.params), body)

    def node_parameters(self, node):
        argnames = []
        if node.defaults:
            posargs = node.args[:-len(node.defaults)]
            optargs = ["%s = %s" % (x, y) for x, y in zip(node.args[-len(node.defaults):], self.comp(node.defaults))]
        else:
            posargs = node.args[:]
            optargs = []

        argnames.extend(posargs)
        argnames.extend(optargs)

        if node.varargs:
            argnames.append("*%s" % node.varargs)

        if node.kwargs:
            argnames.append("**%s" % node.kwargs)

        return ", ".join(argnames)

    def node_tryexcept(self, node):
        body = "\n".join(self.indent(self.comp(node.body)))
        excpt = "\n".join(self.comp(node.handlers))
        if node.orelse:
            orelse = "\nelse:\n%s" % "\n".join(self.indent(self.comp(node.orelse)))
        else:
            orelse = ""
        return "try:\n%s\n%s%s\n" % (body, excpt, orelse)

    def node_tryfinally(self, node):
        body = "\n".join(self.indent(self.comp(node.body)))
        finalbody = "\n".join(self.indent(self.comp(node.finalbody)))
        return "try:\n%s\nfinally:\n%s\n" % (body, finalbody)

    def node_tryhandler(self, node):
        if node.type and node.name:
            handle = " %s, %s" % (self.comp(node.type), self.comp(node.name))
        elif node.type:
            handle = " %s" % self.comp(node.type)
        else:
            handle = ""
        return "except%s:\n%s" % (handle, "\n".join(self.indent(self.comp(node.body))))

    def node_assign(self, node):
        return "%s = %s" % (" = ".join(self.comp(node.lvalue)), self.comp(node.rvalue))

    def node_tuple(self, node):
        return "(%s)" % ", ".join(self.comp(node.elts))

    def node_augassign(self, node):
        assert node.op in self.opmap
        return "%s %s= %s" % (self.comp(node.target), self.opmap[node.op], self.comp(node.value))

    def node_foreach(self, node):
        if node.orelse:
            orelse = "\nelse:\n%s" % "\n".join(self.indent(self.comp(node.orelse)))
        else:
            orelse = ""
        return "for %s in %s:\n%s%s\n" % (self.comp(node.target), self.comp(node.iter), "\n".join(self.indent(self.comp(node.body))), orelse)

    def node_classdef(self, node):
        assert node.decorators == []
        return "class %s(%s):\n%s" % (node.name, ", ".join(self.comp(node.bases)), "\n".join(self.indent(self.comp(node.body))))

    def node_delete(self, node):
        return "del %s" % self.comp(node.targets)

    def node_if(self, node):
        if node.orelse:
            orelse = "\nelse:\n%s" % "\n".join(self.indent(self.comp(node.orelse)))
        else:
            orelse = ""
        return "if %s:\n%s%s" % (self.comp(node.cond), "\n".join(self.indent(self.comp(node.body))), orelse)

    def node_compare(self, node):
        ret = []
        for op, cval in zip(node.ops, node.comps):
            assert op in self.compmap
            ret.append("%s %s" % (self.compmap[op], self.comp(cval)))
        return "%s %s" % (self.comp(node.lvalue), " ".join(ret))

    def node_subscript(self, node):
        return "%s[%s]" % (self.comp(node.value), self.comp(node.slice))

def format(ist):
    p = Printer()
    return p.comp(ist)
