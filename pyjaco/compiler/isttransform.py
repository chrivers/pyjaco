import ist
import istcompiler

class Transformer(istcompiler.Multiplexer):

    def comp(self, node):
        if isinstance(node, list):
            res = []
            for n in node:
                if isinstance(n, ist.ISTNode):
                    c = self.comp(n)
                    if c:
                        res.append(c)
                else:
                    res.append(n)
            return res
        else:
            name = "node_%s" % node.__class__.__name__.lower()
            if hasattr(self, name):
                return getattr(self, name)(node)
            else:
                for f in node._fields:
                    value = getattr(node, f)
                    if isinstance(value, (ist.ISTNode, list)):
                        setattr(node, f, self.comp(value))
                return node
