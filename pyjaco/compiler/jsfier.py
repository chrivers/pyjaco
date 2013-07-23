import ist
import sys
G = globals()
for x in ist.__all__:
    G["I%s" % x] = getattr(ist, x)
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

    def compute(self, tree):
        self.index_var = 0
        self.future_division = False
        return self.comp(tree)

    def alloc_var(self):
        self.index_var += 1
        return "$v%d" % self.index_var

    def node_name(self, node):
        if node.id in ["abs", "all", "any", "apply", "bin", "callable", "chr", "cmp", "coerce", "delattr", "dir", "enumerate", "filter", "getattr", "hasattr", "hash", "help", "hex", "id", "intern", "isinstance", "issubclass", "len", "license", "map", "max", "min", "oct", "ord", "pow", "quit", "range", "reduce", "repr", "reversed", "round", "setattr", "sorted", "staticmethod", "sum", "type", "unichr", "xrange", "zip"]:
            return ist.GetAttr(base = ist.Name(id = "__builtins__"), attr = "PY$%s" % node.id)
        else:
            return node

    def node_getattr(self, node):
        if isinstance(node.base, ist.Name) and node.base.id == "__builtins__":
            return node
        else:
            return ist.Call(args = [ist.String(value = node.attr)], func = ist.GetAttr(base = self.comp(node.base), attr = "PY$__getattr__"), keywords = [], kwargs = None, varargs = None)

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
        return ist.Call(func = ist.Name(id = "list"), args = [ist.List(values = self.comp(node.values))])

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
        return ist.Call(func = ist.Name(id = "str"), args = [ist.String(value = node.value)])

    def node_call(self, node):
        js = []
        node.func = self.comp(node.func)
        node.args = self.comp(node.args)
        if isinstance(node.func, ist.GetAttr) and node.func.base.id == '__builtins__' and node.func.attr == "print":
            node.func.attr = "PY$print"


        if node.varargs:
            node.args += [ist.Call(func = ist.Name(id = "__varargs_make"), args = [self.comp(node.varargs)])]
            node.varargs = None

        if node.keywords or node.kwargs:
            args = []
            if node.keywords:
                keys, values = zip(*node.keywords)
                args.append(ist.Dict(keys = [ist.Name(id = k) for k in keys], values = self.comp(list(values))))
                node.keywords = None
            else:
                args.append(ist.Dict(keys = [], values = []))

            if node.kwargs:
                args.append(self.comp(node.kwargs))
                node.kwargs = None

            node.args += [ist.Call(func = ist.Name(id = "__kwargs_make"), args = args)]

        return node

    def node_binop(self, node):
        if node.op == "Div":
            if self.future_division:
                op = "div"
            else:
                op = "floordiv"
        else:
            op = self.ops_binop[node.op]
        return ist.Call(func = ist.GetAttr(base = self.comp(node.left), attr = "PY$__%s__" % op), args = [self.comp(node.right)])

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
                          cond = ist.Assign(lvalue = [for_target], rvalue = ist.Call(func = ist.GetAttr(base = ist.Name(id = "$PY"), attr = "next"), args = [ist.Name(id = iter_var)])),
                          incr = None
                          ))

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

    def node_importfrom(self, node):
        return node

    def node_assign(self, node):
        res = []
        if len(node.lvalue) > 1:
            tmp = self.alloc_var()
            res.append(ist.Var(name = tmp, expr = self.comp(node.rvalue)))
            for lval in node.lvalue:
                res.extend(self.assign_simple(lval, ist.Name(id = tmp)))
            return res
        else:
            return self.assign_simple(node.lvalue[0], self.comp(node.rvalue))

    def assign_simple(self, target, value):
        if isinstance(target, (ist.Tuple, ist.List)):
            raise NotImplementedError()
            t1 = self.alloc_var()
            js = [ist.Var(name = t1, expr = value)]

            for i, target in enumerate(target.elts):
                var = self.comp(target)
        elif isinstance(target, ist.Subscript) and isinstance(target.slice, (ist.Number, ist.String)):
            js = [ist.Call(func = ist.GetAttr(base = self.comp(target.value), attr = "PY$__setitem__"), args = [self.comp(target.slice), value])]
        elif isinstance(target, ist.Subscript) and isinstance(target.slice, ist.Slice):
            raise NotImplementedError()
        else:
            if isinstance(target, ist.Name):
                var = target.id
                js = [ist.Var(name = var, expr = value)]
            elif isinstance(target, ist.GetAttr):
                js = [ist.Call(func = ist.GetAttr(base = self.comp(target.value), attr = "PY$__setattr__"), args = [self.comp(target.slice), value])]
            else:
                print target
                raise NotImplementedError()
        return js

    def node_function(self, node):
        #'args', 'defaults', 'kwargs', 'str', 'varargs'
        defaults = [None] * (len(node.params.args) - len(node.params.defaults)) + node.params.defaults
        offset = 0

        js = []

        if node.params.kwargs:
            kwarg_name = node.params.kwargs
        else:
            kwarg_name = "__kwargs"

        if node.params.varargs:
            vararg_name = node.params.varargs
        else:
            vararg_name = "__varargs"

        js.append(IVar(name = kwarg_name,  expr = ICall(func = IName(id = "__kwargs_get"),  args = [IName(id = "arguments")])))
        js.append(IVar(name = vararg_name, expr = ICall(func = IName(id = "__varargs_get"), args = [IName(id = "arguments")])))

        newargs = self.alloc_var()
        js.append(IVar(name = newargs, expr = ICall(
                    func = IGetAttr(
                        base =
                        ICall(
                            func = IGetAttr(
                                base = IGetAttr(base = IGetAttr(base = IName(id = "Array"), attr = "prototype"), attr = "slice"),
                                attr = "call"),
                            args = [IName(id = "arguments")]),
                        attr = "concat"),
                    args = [ICall(func = IName(id = "js"), args = [IName(id = vararg_name)])]
                    )))

        if node.params.kwargs:
            node.body.insert(0, IAssign(lvalue = [IName(id = kwarg_name)], rvalue = ICall(func = IName(id = "dict"), args = [IName(id = kwarg_name)])))
            node.params.kwargs = None

        if node.params.varargs:
            node.body.insert(0, IAssign(lvalue = [IName(id = node.params.varargs)], rvalue = IName(id = "tuple(%s.slice(0))" % (newargs))))
            node.params.varargs = None

        for i, arg in enumerate(node.params.args):
            values = dict(i = i, id = arg, rawid = arg, kwarg = kwarg_name, newargs = newargs, func = node.name)

            if defaults[i + offset] == None:
                js.append(
                    IVar(
                        name = arg,
                        expr = IIfExp(
                            cond   = IBinOp(left = IString(value = arg), op = "In", right = IName(id = kwarg_name)),
                            body   = ISubscript(value = IName(id = kwarg_name), slice = IString(value = arg)),
                            orelse = ISubscript(value = IName(id = newargs),    slice = INumber(value = i)))))
            else:
                values['default'] = self.comp(defaults[i + offset])
                js.append(IVar(name = arg, expr = ISubscript(value = IName(id = newargs), slice = INumber(value = i))))
                js.append(IIf(cond = ICompare(lvalue = IName(id = arg), ops = ["Eq"], comps = [IName(id = "undefined")]), body = [
                            IAssign(
                                lvalue = IName(id = arg),
                                rvalue = IIfExp(
                                    cond = ICompare(
                                        lvalue = IGetAttr(
                                            base = IName(id = kwarg_name),
                                            attr = arg),
                                        comps = [IName(id = "undefined")],
                                        ops = ["Eq"]),
                                    body = self.comp(defaults[i + offset]),
                                    orelse = IGetAttr(
                                        base = IName(id = kwarg_name),
                                        attr = arg)))]))
            js.append(IDelete(targets = [IGetAttr(base = IName(id = kwarg_name), attr = arg)]))

        node.params.defaults = []

        node.params.args = []

        node.body = js + self.comp(node.body)
        if not (node.body and isinstance(node.body[-1], IReturn)):
            node.body.append(IReturn(expr = IName(id = "None")))

        return node
