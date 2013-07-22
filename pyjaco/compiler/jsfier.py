import ist
import istcompiler
import isttransform

class Transformer(isttransform.Transformer):

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

    def comp(self, node):
        self.index_var = 0
        return super(Transformer, self).comp(node)

    def alloc_var(self):
        self.index_var += 1
        return "$v%d" % self.index_var

    def node_name(self, node):
        if node.id in ["range"]:
            return ist.GetAttr(base = ist.Name(id = "__builtins__"), attr = "PY$%s" % node.id)
        else:
            return node

    def node_getattr(self, node):
        if isinstance(node.base, ist.Name) and node.base.id == "__builtins__":
            return node
        else:
            return ist.Call(args = [ist.String(value = node.attr)], func = ist.GetAttr(base = node.base, attr = "PY$__getattr__"), keywords = [], kwargs = None, varargs = None)

    def node_tuple(self, node):
        return ist.Call(func = ist.Name(id = "tuple"), args = [ist.List(values = self.comp(node.values))])

    def node_return(self, node):
        if not node.expr:
            node.expr = [ist.Name(id = "None")]
        else:
            node.expr = self.comp(node.expr)
        return node

    def node_dict(self, node):
        els = []
        for k, v in zip(node.keys, node.values):
            els.append(self.comp(k))
            els.append(self.comp(v))
        return ist.Call(func = ist.Name(id = "dict"), args = [ist.List(values = els)])

    def node_list(self, node):
        return ist.Call(func = ist.Name(id = "list"), args = [node])

    def node_subscript(self, node):
        return ist.Call(args = [self.comp(node.slice)],
                        func = ist.GetAttr(base = self.comp(node.value), attr = "PY$__getitem__"),
                        keywords = [],
                        kwargs = None,
                        varargs = None)

    def node_number(self, node):
        if isinstance(node.value, (int, long)):
            if 0 <= node.value <= 9:
                return ist.Name(id = "$c%s" % node.value)
            elif -2**53 <= node.value <= 2**53:
                return ist.Call(func = ist.Name(id = "int"), args = [node])
            else:
                raise NotImplementedError("JS doesn't support long numbers")
        elif isinstance(node.value, float):
            return ist.Call(func = ist.Name(id = "float"), args = [node])
        else:
            raise NotImplementedError("Unknown numeric type: %s" % node.n.__class__.__name__)

    def node_slice(self, node):
        if node.lower and node.upper and node.step:
            return ist.Call(func = ist.Name(id = "slice"), args = [self.comp(node.lower), self.comp(node.upper), self.comp(node.step)])
        if node.lower and node.upper:
            return ist.Call(func = ist.Name(id = "slice"), args = [self.comp(node.lower), self.comp(node.upper)])
        if node.upper and not node.step:
            return ist.Call(func = ist.Name(id = "slice"), args = [self.comp(node.upper)])
        if node.lower and not node.step:
            return ist.Call(func = ist.Name(id = "slice"), args = [self.comp(node.lower), ist.Name(id = "null")])
        if not node.lower and not node.upper and not node.step:
            return ist.Call(func = ist.Name(id = "slice"), args = [ist.Name(id = "null")])
        raise NotImplementedError("Slice")

    def node_string(self, node):
        return ist.Call(func = ist.Name(id = "str"), args = [node])

    def node_call(self, node):
        node.func = self.comp(node.func)
        node.args = self.comp(node.args)
        if isinstance(node.func, ist.GetAttr) and node.func.base.id == '__builtins__' and node.func.attr == "print":
            node.func.attr = "PY$print"
        return node

    def node_binop(self, node):
        return ist.Call(func = ist.GetAttr(base = self.comp(node.left), attr = "PY$__%s__" % self.ops_binop[node.op]), args = [self.comp(node.right)])

    def node_unaryop(self, node):
        if node.op == "Invert":
            return ist.Call(func = ist.GetAttr(base = ist.Name(id = "$PY"), attr = "__not__"), args = [self.comp(node.lvalue)])
        else:
            raise NotImplementedError()

    def node_if(self, node):
        node.cond = ist.Compare(lvalue = ist.Call(func = ist.Name(id = "bool"), args = [self.comp(node.cond)]), ops = ["Eq"], comps = [ist.Name(id = "True")])
        node.body = self.comp(node.body)
        return node

    def node_while(self, node):
        node.cond = ist.Compare(lvalue = ist.Call(func = ist.Name(id = "bool"), args = [self.comp(node.cond)]), ops = ["Eq"], comps = [ist.Name(id = "True")])
        node.body = self.comp(node.body)
        return node

    def node_foreach(self, node):
        if isinstance(node.target, ist.Name):
            for_target = self.comp(node.target)
        elif isinstance(node.target, ist.Tuple):
            for_target = ist.Name(id = self.alloc_var())
        else:
            raise JSError("Advanced for-loop decomposition not supported")

        js = []

        for_iter = self.comp(node.iter)
        iter_var = self.alloc_var()
        exc_var = self.alloc_var()

        if node.orelse:
            orelse_var = self.alloc_var()
            js.append(ist.Var(name = orelse_var, expr = ist.Name(id = "true")))

        js.append(ist.Var(name = for_target.id))
        js.append(ist.For(body = self.comp(node.body),
                          init = ist.Var(name = iter_var, expr = ist.Call(func = ist.Name(id = "iter"), args = [for_iter])),
                          cond = ist.Compare(lvalue = for_target, ops = ["NotEq"], comps = [ist.Name(id = "null")]),
                          incr = ist.Assign(lvalue = [for_target], rvalue = ist.Call(func = ist.GetAttr(base = ist.Name(id = "$PY"), attr = "next"), args = [ist.Name(id = iter_var)]),
                          )))

        return js



    def node_compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comps) == 1
        op = node.ops[0]
        if op in self.ops_compare:
            return ist.Call(func = ist.GetAttr(base = self.comp(node.lvalue), attr = "PY$__%s__" % self.ops_compare[op]), args = [self.comp(node.comps[0])])
        elif op == "In":
            return ist.Call(func = ist.GetAttr(base = self.comp(node.comps[0]), attr = "PY$__contains__"), args = [self.comp(node.lvalue)])
        elif op == "NotIn":
            return ist.Call(func = ist.GetAttr(base = ist.Name(id = "$PY"), attr = "__not__"), args = [
                    ist.Call(func = ist.GetAttr(base = self.comp(node.comps[0]), attr = "PY$__contains__"), args = [self.comp(node.lvalue)])
                    ])
        else:
            raise NotImplementedError()
        return node
