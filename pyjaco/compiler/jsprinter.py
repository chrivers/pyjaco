import ist
import istcompiler

class Printer(istcompiler.Multiplexer):

    JS_MAX_INT = 2**53
    JS_MIN_INT = -2**53

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
        ## Non-aug ops
        And      = "&&",
        Or       = "||",
        In       = "in"
        )

    compmap = dict(
        Gt = ">",
        Lt = "<",
        Eq = "===",
        GtE = ">=",
        LtE = "<=",
        NotEq = "!==",
        )

    uopmap = dict(
        UAdd = "+",
        USub = "-",
        Not  = "!",
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

    def block(self, block):
        self.indent()
        for b in block:
            if type(b) == list:
                self.dedent()
                self.block(b)
                self.indent()
            else:
                res = self.comp(b)
                if res:
                    self.line(res + ";")
        self.dedent()

    def capture(self, block):
        buf = self.buffer
        self.buffer = []
        self.block(block)
        res = self.buffer
        self.buffer = buf
        return res

    def node_module(self, node):
        self.block(node.body)

    def node_getattr(self, node):
        return "%s.%s" % (self.comp(node.base), node.attr)

    def node_value(self, node):
        return self.comp(node.value)

    def node_number(self, node):
        if node.value > self.JS_MAX_INT or node.value < self.JS_MIN_INT:
            raise NotImplementedError("JS does not support numbers greater than +/-2^53")
        return "%s" % node.value

    def node_binop(self, node):
        if node.op not in self.opmap:
            raise NotImplementedError(node.op)
        return "(%s %s %s)" % (self.comp(node.left), self.opmap[node.op], self.comp(node.right))

    def node_boolop(self, node):
        return "(%s)" % (" %s " % self.opmap[node.op]).join((self.comp(val) for val in node.values))

    def node_string(self, node):
        return repr(node.value).lstrip("urb")

    def node_call(self, node):
        args = self.comp(node.args)

        if node.keywords:
            raise NotImplementedError("JS does not support keyword arguments")

        if node.varargs:
            raise NotImplementedError("JS does not support varargs")
            args.append("*%s" % self.comp(node.varargs))

        if node.kwargs:
            raise NotImplementedError("JS does not support kwargs")

        return "%s(%s)" % (self.comp(node.func), ", ".join(args))

    def node_name(self, node):
        return node.id

    def node_return(self, node):
        return "return %s" % self.comp(node.expr)

    def node_nop(self, node):
        return "/* pass */"

    def node_function(self, node):
        if node.decorators:
            raise NotImplementedError("JS does not support decorators")

        self.line("function %s(%s) {" % (node.name, self.comp(node.params)))
        self.block(node.body)
        self.line("}")

    def node_parameters(self, node):
        argnames = []
        if node.defaults:
            raise NotImplementedError("JS does not support default values")
        else:
            posargs = node.args[:]
            optargs = []

        argnames.extend(posargs)
        argnames.extend(optargs)

        if node.varargs:
            raise NotImplementedError("JS does not support varargs")

        if node.kwargs:
            raise NotImplementedError("JS does not support kwargs")

        return ", ".join(argnames)

    def node_tryexcept(self, node):
        self.line("try {")
        self.block(node.body)
        if len(node.handlers) <> 1:
            raise NotImplementedError("JS does not support multiple exception handlers")

        self.comp(node.handlers[0])
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks in try-except")

    def node_tryfinally(self, node):
        self.line("try {")
        self.block(node.body)
        self.line("} finally {")
        self.block(node.finalbody)
        self.line("}")

    def node_tryhandler(self, node):
        if node.type:
            raise NotImplementedError("JS does not support typed exception handlers")
        assert isinstance(node.name, ist.Name)
        self.line("} catch (%s) {" % node.name.id)
        self.block(node.body)
        self.line("}")

    def node_assign(self, node):
        assert type(node.lvalue) == list
        return "%s = %s" % (" = ".join(self.comp(node.lvalue)), self.comp(node.rvalue))

    def node_tuple(self, node):
        raise NotImplementedError("JS does not support tuples")

    def node_augassign(self, node):
        assert node.op in self.opmap
        return "%s %s= %s" % (self.comp(node.target), self.opmap[node.op], self.comp(node.value))

    def node_foreach(self, node):
        self.line("for (%s in %s) {" % (self.comp(node.target), self.comp(node.iter)))
        self.block(node.body)
        self.line("}")
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks in foreach")

    def node_for(self, node):
        self.line("for (%s; %s; %s) {" % (self.comp(node.init) if node.init else "",
                                          self.comp(node.cond) if node.cond else "",
                                          self.comp(node.incr) if node.incr else ""))
        self.block(node.body)
        self.line("}")

    def node_classdef(self, node):
        raise NotImplementedError("JS does not support classes")

    def node_delete(self, node):
        if len(node.targets) == 1:
            return "delete %s" % self.comp(node.targets[0])
        else:
            raise NotImplementedError("JS does not support multiple deletes")

    def node_if(self, node):
        self.line("if (%s) {" % self.comp(node.cond))
        self.block(node.body)
        if node.orelse:
            self.line("} else {")
            self.block(node.orelse)
            self.line("}")
        else:
            self.line("}")
            return

    def node_while(self, node):
        self.line("while (%s) {" % self.comp(node.cond))
        self.block(node.body)
        self.line("}")
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks in while")

    def node_compare(self, node):
        if len(node.ops) <> 1:
            raise NotImplementedError("JS does not support multi-term comparisons")
        return "%s %s %s" % (self.comp(node.lvalue), self.compmap[node.ops[0]], self.comp(node.comps[0]))

    def node_getitem(self, node):
        return "%s[%s]" % (self.comp(node.value), self.comp(node.slice))

    def node_list(self, node):
        return "[%s]" % ", ".join(self.comp(node.values))

    def node_continue(self, node):
        return "continue"

    def node_break(self, node):
        return "break"

    def node_lambda(self, node):
        return "function%s(%s) {\n%s\n%s}" % (
            " PY$%s" % node.name if node.name else "",
            self.comp(node.params) if node.params else "",
            "\n".join(self.capture(node.body)),
            " " * self.indentation)

    def node_unaryop(self, node):
        return "%s%s" % (self.uopmap[node.op], self.comp(node.lvalue))

    def node_float(self, node):
        return repr(node)

    def node_raise(self, node):
        if node.expr:
            self.line("throw %s;" % (self.comp(node.expr)))
        else:
            raise NotImplementedError("JS does not support re-raising exceptions")

    def node_dict(self, node):
        return "{%s}" % ", ".join(["%s: %s" % (self.comp(key), self.comp(value)) for key, value in zip(node.keys, node.values)])

    def node_global(self, node):
        raise NotImplementedError("JS does not support global scope imports")

    def node_yield(self, node):
        raise NotImplementedError("JS does not support yield")

    def node_slice(self, node):
        raise NotImplementedError("JS does not support slices")

    def node_generator(self, node):
        raise NotImplementedError("JS does not support generators")

    def node_comprehension(self, node):
        raise NotImplementedError("JS does not support comprehension")

    def node_import(self, node):
        raise NotImplementedError("JS does not support import")

    def node_importfrom(self, node):
        raise NotImplementedError("JS does not support import")

    def node_var(self, node):
        if node.expr:
            return "var %s = %s" % (node.name, self.comp(node.expr))
        else:
            return "var %s" % node.name

    def node_ifexp(self, node):
        return "(%s ? %s : %s)" % (self.comp(node.cond), self.comp(node.body), self.comp(node.orelse))
