import ist
import istcompiler

class Printer(istcompiler.Multiplexer):

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
        And      = "and",
        Or       = "or"
        )

    compmap = dict(
        Gt = ">",
        Lt = "<",
        Eq = "==",
        GtE = ">=",
        LtE = "<=",
        NotEq = "<>",
        NotIn = "not in",
        Is = "is",
        In = "in",
        Or = "or"
        )

    uopmap = dict(
        UAdd = "+",
        USub = "-",
        Not  = "not ",
        Invert = "~",
        )

    def format(self, tree):
        self.buffer = []
        self.indentation = -4
        self.comp(tree)
        if self.buffer and self.buffer[-1].strip() == "":
            self.buffer.pop()
        return "\n".join(self.buffer)

    def line(self, line):
        self.buffer.append(" " * self.indentation + line)

    def indent(self, indent = 4):
        self.indentation += indent

    def dedent(self, indent = 4):
        self.indentation -= indent

    def block(self, block, end = True):
        self.indent()
        for b in block:
            res = self.comp(b)
            if res:
                self.line(res)
        self.dedent()
        if self.buffer and self.buffer[-1].strip() <> "" and end:
            self.line("")

    def node_getattr(self, node):
        return "%s.%s" % (self.comp(node.base), node.attr)

    def node_number(self, node):
        return self.comp(node.value)

    def node_int(self, node):
        return "%s" % node

    def node_num(self, node):
        return "%s" % node.value

    def node_binop(self, node):
        if node.op not in self.opmap:
            raise NotImplementedError(node.op)
        return "(%s %s %s)" % (self.comp(node.left), self.opmap[node.op], self.comp(node.right))

    def node_boolop(self, node):
        return (" %s " % self.opmap[node.op]).join(self.comp(x) for x in node.values)

    def node_string(self, node):
        return repr(node.value)

    def node_call(self, node):
        args = self.comp(node.args)

        if node.keywords:
            args.extend("%s = %s" % (x[0], self.comp(x[1])) for x in node.keywords)

        if node.varargs:
            args.append("*%s" % self.comp(node.varargs))

        if node.kwargs:
            args.append("**%s" % self.comp(node.kwargs))

        if isinstance(node.func, ist.GetAttr) and isinstance(node.func.base, ist.Name) and node.func.base.id == "__builtins__" and node.func.attr == "print":
            return "print %s" % ", ".join(args)
        else:
            return "%s(%s)" % (self.comp(node.func), ", ".join(args))

    def node_name(self, node):
        return node.id

    def node_return(self, node):
        self.line("return %s" % self.comp(node.expr))

    def node_nop(self, node):
        self.line("pass")

    def node_function(self, node):
        for deco in node.decorators:
            self.line("@%s" % self.comp(deco))
        self.line("def %s(%s):" % (node.name, self.comp(node.params)))
        if node.body == []:
            self.block([Nop()])
        else:
            if isinstance(node.body[0], ist.String):
                self.indent()
                self.line('"""%s"""' % repr(node.body[0].value)[1:-1].replace("\\n", "\n"))
                self.dedent()
                self.block(node.body[1:])
            else:
                self.block(node.body)

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
        self.line("try:")
        self.block(node.body, end = False)
        for handler in node.handlers:
            self.comp(handler)
        if node.orelse:
            self.line("else:")
            self.block(node.orelse)

    def node_tryfinally(self, node):
        self.line("try:")
        self.block(node.body, end = False)
        self.line("finally:")
        self.block(node.finalbody)

    def node_tryhandler(self, node):
        if node.type and node.name:
            handle = " %s, %s" % (self.comp(node.type), self.comp(node.name))
        elif node.type:
            handle = " %s" % self.comp(node.type)
        else:
            handle = ""
        self.line("except%s:" % handle)
        self.block(node.body, end = False)

    def node_assign(self, node):
        self.line("%s = %s" % (" = ".join(self.comp(node.lvalue)), self.comp(node.rvalue)))

    def node_tuple(self, node):
        if len(node.values) == 0:
            return "()"
        elif len(node.values) == 1:
            return "(%s,)" % self.comp(node.values[0])
        else:
            return "(%s)" % ", ".join(self.comp(node.values))

    def node_augassign(self, node):
        assert node.op in self.opmap
        return "%s %s= %s" % (self.comp(node.target), self.opmap[node.op], self.comp(node.value))

    def node_foreach(self, node):
        self.line("for %s in %s:" % (self.comp(node.target), self.comp(node.iter)))
        self.block(node.body)
        if node.orelse:
            self.line("else:")
            self.block(node.orelse)

    def node_classdef(self, node):
        assert node.decorators == []
        self.line("class %s(%s):" % (node.name, ", ".join(self.comp(node.bases))))
        self.block(node.body)

    def node_delete(self, node):
        return "del %s" % ", ".join(self.comp(node.targets))

    def node_if(self, node):
        self.line("if %s:" % self.comp(node.cond))
        self.block(node.body, end = bool(node.orelse))
        if node.orelse:
            self.line("else:")
            self.block(node.orelse)

    def node_while(self, node):
        self.line("while %s:" % self.comp(node.cond))
        self.block(node.body)
        if node.orelse:
            self.line("else:")
            self.block(node.orelse)

    def node_ifexp(self, node):
        self.line("%s if %s else %s" % (self.comp(node.body), self.comp(node.cond), self.comp(node.orelse)))

    def node_compare(self, node):
        ret = []
        for op, cval in zip(node.ops, node.comps):
            if op not in self.compmap:
                raise NotImplementedError("Unknown comparison operator: %s" % op)
            ret.append("%s %s" % (self.compmap[op], self.comp(cval)))
        return "%s %s" % (self.comp(node.lvalue), " ".join(ret))

    def node_subscript(self, node):
        return "%s[%s]" % (self.comp(node.value), self.comp(node.slice))

    def node_list(self, node):
        return "[%s]" % ", ".join(self.comp(node.values))

    def node_continue(self, node):
        return "continue"

    def node_break(self, node):
        return "break"

    def node_lambda(self, node):
        if node.args:
            args = " %s" % self.comp(node.args)
        else:
            args = ""
        return "(lambda%s: %s)" % (args, self.comp(node.body))

    def node_unaryop(self, node):
        return "%s%s" % (self.uopmap[node.op], self.comp(node.lvalue))

    def node_float(self, node):
        return repr(node)

    def node_raise(self, node):
        if node.expr:
            self.line("raise %s" % (self.comp(node.expr)))
        else:
            self.line("raise")

    def node_dict(self, node):
        return "{%s}" % (", ".join('%s: %s' % (self.comp(key), self.comp(value)) for key, value in zip(node.keys, node.values)))

    def node_global(self, node):
        return "global %s" % ", ".join(node.names)

    def node_yield(self, node):
        if node.value:
            self.line("yield %s" % (self.comp(node.value)))
        else:
            self.line("yield")

    def node_slice(self, node):
        if node.lower:
            lower = self.comp(node.lower)
        else:
            lower = ""

        if node.upper:
            upper = self.comp(node.upper)
        else:
            upper = ""

        if node.step:
            step = ":%s" % self.comp(node.step)
        else:
            step = ""

        return "%s:%s%s" % (lower, upper, step)

    def node_generator(self, node):
        gens = []
        for gen in node.generators:
            gens.append(self.comp(gen))
        return "%s %s" % (self.comp(node.value), " ".join(gens))

    def node_listcomp(self, node):
        gens = []
        for gen in node.generators:
            gens.append(self.comp(gen))
        return "[%s %s]" % (self.comp(node.value), " ".join(gens))

    def node_comprehension(self, node):
        conds = [""]
        for cond in node.conds:
            conds.append(self.comp(cond))
        return "for %s in %s%s" % (self.comp(node.target), self.comp(node.iter), " if ".join(conds))

    def node_nonetype(self, node):
        return "None"

    def node_import(self, node):
        names = []
        for name, asname in node.names.items():
            if asname:
                names.append("%s as %s" % (name, asname))
            else:
                names.append(name)
        self.line("import %s" % ", ".join(names))

    def node_importfrom(self, node):
        names = []
        for name, asname in node.names.items():
            if asname:
                names.append("%s as %s" % (name, asname))
            else:
                names.append(name)
        self.line("from %s import %s" % (node.module, ", ".join(names)))

    def node_module(self, node):
        self.block(node.body)

    def node_assert(self, node):
        if node.msg:
            self.line("assert %s, %s" % (self.comp(node.cond), self.comp(node.msg)))
        else:
            self.line("assert %s" % self.comp(node.cond))

def format(ist):
    p = Printer()
    return p.format(ist)
