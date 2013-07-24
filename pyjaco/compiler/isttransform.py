import ist
import istcompiler

class Transformer(istcompiler.Multiplexer):

    def __init__(self):
        self.stack = []
        return super(Transformer, self).__init__()

    def destiny(self, names, skip):
        for name in reversed(self.stack[:-skip]):
            if name in names:
                return name
        else:
            return False

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
            classname = node.__class__.__name__.lower()
            name = "node_%s" % classname
            self.stack.append(classname)
            if hasattr(self, name):
                res = getattr(self, name)(node)
            else:
                for f in node._fields:
                    value = getattr(node, f)
                    if isinstance(value, (ist.ISTNode, list)):
                        setattr(node, f, self.comp(value))
                res = node
            self.stack.pop()
            return res
