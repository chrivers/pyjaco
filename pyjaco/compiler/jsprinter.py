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
        Not  = "!",
        Invert = "~",
        )

    def format(self, tree):
        self.buffer = []
        self.indentation = -4
        self.line('load("py-builtins.js")')
        self.comp(tree)
        if self.buffer and self.buffer[-1].strip() == "":
            self.buffer.pop()
        return "\n".join(self.buffer)

    def line(self, line):
        self.buffer.append(" " * self.indentation + line + ";" if line else "")

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
        if self.buffer[-1].strip() <> "" and end:
            self.line("")

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
        if len(node.values) <> 2:
            raise NotImplementedError("JS does not support multi-term boolean operations")
        return "(%s %s %s)" % (self.comp(node.values[0]), self.opmap[node.op], self.comp(node.values[1]))

    def node_string(self, node):
        return repr(node.value)

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
        self.line("return %s" % self.comp(node.expr))

    def node_nop(self, node):
        self.line("/* pass */")

    def node_function(self, node):
        for deco in node.decorators:
            raise NotImplementedError("JS does not support decorators")

        self.line("function %s(%s) {" % (node.name, self.comp(node.params)))
        self.block(node.body, end = False)
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
        self.block(node.body, end = False)
        if len(node.handlers) <> 1:
            raise NotImplementedError("JS does not support multiple exception handlers")

        self.comp(node.handlers[0])
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks")

    def node_tryfinally(self, node):
        self.line("try {")
        self.block(node.body, end = False)
        self.line("} finally {")
        self.block(node.finalbody, end = False)
        self.line("}")

    def node_tryhandler(self, node):
        if node.type and node.name:
            handle = " %s, %s" % (self.comp(node.type), self.comp(node.name))
        elif node.type:
            handle = " %s" % self.comp(node.type)
        else:
            handle = ""
        self.line("catch (%s) {" % handle)
        self.block(node.body, end = False)
        self.line("}")

    def node_assign(self, node):
        self.line("%s = %s" % (" = ".join(self.comp(node.lvalue)), self.comp(node.rvalue)))

    def node_tuple(self, node):
        raise NotImplementedError("JS does not support tuples")

    def node_augassign(self, node):
        assert node.op in self.opmap
        return "%s %s= %s" % (self.comp(node.target), self.opmap[node.op], self.comp(node.value))

    def node_foreach(self, node):
        self.line("for (%s in %s) {" % (self.comp(node.target), self.comp(node.iter)))
        self.block(node.body, end = False)
        self.line("}")
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks")

    def node_classdef(self, node):
        raise NotImplementedError("JS does not support classes")

    def node_delete(self, node):
        if len(node.targets) == 1:
            return "delete %s" % self.comp(node.targets[0])
        else:
            raise NotImplementedError("JS does not support multiple deletes")

    def node_if(self, node):
        self.line("if (%s) {" % self.comp(node.cond))
        self.block(node.body, end = False)
        self.line("}")
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks")

    def node_while(self, node):
        self.line("while (%s) {" % self.comp(node.cond))
        self.block(node.body, end = False)
        self.line("}")
        if node.orelse:
            raise NotImplementedError("JS does not support orelse blocks")

    def node_compare(self, node):
        if len(node.ops) <> 1:
            raise NotImplementedError("JS does not support multi-term comparisons")
        return "%s %s %s" % (self.comp(node.lvalue), self.compmap[node.ops[0]], self.comp(node.comps[0]))

    def node_subscript(self, node):
        return "%s[%s]" % (self.comp(node.value), self.comp(node.slice))

    def node_list(self, node):
        return "[%s]" % ", ".join(self.comp(node.values))

    def node_continue(self, node):
        return "continue"

    def node_break(self, node):
        return "break"

    def node_lambda(self, node):
        raise NotImplementedError("JS does not support lambdas")

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
        raise NotImplementedError("JS does not support dictionaries")

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

def format(ist):
    p = Printer()
    return p.format(ist)
