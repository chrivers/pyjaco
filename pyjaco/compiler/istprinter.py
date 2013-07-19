import istcompiler

class Printer(istcompiler.Multiplexer):

    indentation = 0

    def indent(self, s):
        ind = " " * self.indentation
        if isinstance(s, list):
            res = [ind + n for n in s]
        else:
            return ind + s

    def comp(self, node, indent = 0):
        self.indentation += indent
        if isinstance(node, list):
            print "Visiting a list.."
            res = [self.comp(n) for n in node]
            print "..done"
        else:
            print "Visiting %s with fields [%s]" % (node.__class__.__name__, ", ".join(node._fields))
            res = self.indent(super(Printer, self).comp(node))
        self.indentation -= indent
        return res

    def node_block(self, node):
        return "\n".join(self.comp(stmt) for stmt in node.body)

    def node_attribute(self, node):
        return str(node)

    def node_getattr(self, node):
        return "%s.%s" % (self.comp(node.base), node.attr)

    def node_value(self, node):
        return str(node.value)

    def node_binop(self, node):
        opmap = dict(Add = "+", Sub = "-", Div = "/", Mult = "*", Pow = "**")
        if node.op not in opmap:
            raise NotImplementedError(node.op)
        return "(%s %s %s)" % (self.comp(node.left), opmap[node.op], self.comp(node.right))

    def node_boolop(self, node):
        return str(node)

    def node_string(self, node):
        return '"%s"' % node.value

    def node_call(self, node):
        return "%s(%s)" % (self.comp(node.func), ", ".join(self.comp(node.params)))

    def node_expr(self, node):
        return str(node)

    def node_functiondef(self, node):
        return str(node)

    def node_if(self, node):
        return str(node)

    def node_module(self, node):
        return str(node)

    def node_name(self, node):
        return node.id

    def node_num(self, node):
        return str(node)

    def node_print(self, node):
        return str(node)

    def node_return(self, node):
        return str(node)

    def node_function(self, node):
        print node.body
        if node.body == []:
            body = self.indent("pass")
        else:
            body = "\n".join(self.comp(node.body, 1))
        return "%s(%s):\n%s" % (node.name, ", ".join(self.comp(node.params)), body)

def format(ist):
    p = Printer()
    return p.comp(ist)
