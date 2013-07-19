######################################################################
##
## Copyright 2013 Christian Iversen <ci@sikkerhed.org>
##
## Permission is hereby granted, free of charge, to any person
## obtaining a copy of this software and associated documentation
## files (the "Software"), to deal in the Software without
## restriction, including without limitation the rights to use,
## copy, modify, merge, publish, distribute, sublicense, and/or sell
## copies of the Software, and to permit persons to whom the
## Software is furnished to do so, subject to the following
## conditions:
##
## The above copyright notice and this permission notice shall be
## included in all copies or substantial portions of the Software.
##
## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
## EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
## OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
## NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
## HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
## WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
## FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
## OTHER DEALINGS IN THE SOFTWARE.
##
######################################################################

import ast
from ist import *

class Compiler(object):

    def __init__(self):
        self.compiler = ISTCompiler()

    def compile(self, source, filename = "<unknown>"):
        code = ast.parse(source, filename)

        return self.compiler.comp(code)

class Multiplexer(object):

    def comp(self, node):
        name = "node_%s" % node.__class__.__name__.lower()
#        print node.__class__.__name__, [x for x in dir(node) if not x.startswith("_")]
        if hasattr(self, name):
            return getattr(self, name)(node)
        else:
            raise NotImplementedError("%s does not support node type [%s]" % (self.__class__.__name__, node.__class__.__name__))

    ## Multiplexed functions

    def node_block(self, node):
        raise NotImplementedError()

    def node_attribute(self, node):
        raise NotImplementedError()

    def node_binop(self, node):
        raise NotImplementedError()

    def node_boolop(self, node):
        raise NotImplementedError()

    def node_call(self, node):
        raise NotImplementedError()

    def node_expr(self, node):
        raise NotImplementedError()

    def node_functiondef(self, node):
        raise NotImplementedError()

    def node_if(self, node):
        raise NotImplementedError()

    def node_module(self, node):
        raise NotImplementedError()

    def node_name(self, node):
        raise NotImplementedError()

    def node_num(self, node):
        raise NotImplementedError()

    def node_print(self, node):
        raise NotImplementedError()

    def node_return(self, node):
        raise NotImplementedError()

    def node_str(self, node):
        raise NotImplementedError()

class ISTCompiler(Multiplexer):
    bi = Name(id = "__builtins__")

    ## Multiplexed functions

    def node_attribute(self, node):
        return GetAttr(base = self.comp(node.value), attr = node.attr)

    def node_binop(self, node):
        return BinOp(left = self.comp(node.left), right = self.comp(node.right), op = node.op.__class__.__name__)

    def node_boolop(self, node):
        return BinOp(left = self.comp(node.values[0]), right = self.comp(node.values[1]), op = node.op.__class__.__name__)

    def node_call(self, node):
        assert node.kwargs == None
        assert node.starargs == None
        return Call(func = self.comp(node.func), params = [self.comp(n) for n in node.args])

    def node_expr(self, node):
        return self.comp(node.value)

    def node_functiondef(self, node):
        return Function(body = [self.comp(n) for n in node.body], name = node.name, params = [])

    def node_if(self, node):
        return If(cond = self.comp(node.test), body = [self.comp(n) for n in node.body], orelse = [self.comp(n) for n in node.orelse])

    def node_module(self, node):
        return Block(body = [self.comp(n) for n in node.body])

    def node_name(self, node):
        return Name(id = node.id)

    def node_num(self, node):
        return Value(value = node.n)

    def node_print(self, node):
        assert node.dest == None
        assert node.nl

        return Call(func = GetAttr(base = self.bi, attr = "print"), params = [self.comp(n) for n in node.values])

    def node_return(self, node):
        return Return(expr = self.comp(node.value))

    def node_str(self, node):
        return String(value = node.s)

    def node_pass(self, node):
        return Block(body = [])
