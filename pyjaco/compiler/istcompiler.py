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
        if isinstance(node, list):
            # print "Visiting a list %s" % repr(node)
            return [self.comp(n) for n in node]
        else:
            name = "node_%s" % node.__class__.__name__.lower()
            # print node.__class__.__name__, [x for x in dir(node) if not x.startswith("_")]
            if hasattr(self, name):
                return getattr(self, name)(node)
            else:
                raise NotImplementedError("%s does not support node type [%s]" % (self.__class__.__name__, node.__class__.__name__))

class ISTCompiler(Multiplexer):
    bi = Name(id = "__builtins__")

    ## Multiplexed functions

    def comp(self, node):
        if isinstance(node, list):
            # print "Visiting a list %s" % repr(node)
            return [self.comp(n) for n in node]
        else:
            name = "node_%s" % node.__class__.__name__.lower()
            # print node.__class__.__name__, [x for x in dir(node) if not x.startswith("_")]
            if hasattr(self, name):
                return getattr(self, name)(node)
            else:
                print [x for x in dir(node) if not x.startswith("_") and not x in ["col_offset", "lineno"]]
                raise NotImplementedError("%s does not support node type [%s]" % (self.__class__.__name__, node.__class__.__name__))

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
        return Function(body = [self.comp(n) for n in node.body], name = node.name, params = self.comp(node.args),
                        decorators = [self.comp(n) for n in node.decorator_list])

    def node_if(self, node):
        return If(cond = self.comp(node.test), body = self.comp(node.body), orelse = self.comp(node.orelse))

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
        return Nop()

    def node_arguments(self, node):
        return Parameters(args = [arg.id for arg in node.args],
                          defaults = self.comp(node.defaults),
                          kwargs = node.kwarg, varargs = node.vararg)

    def node_tryexcept(self, node):
        return TryExcept(body = self.comp(node.body),
                         handlers = self.comp(node.handlers),
                         orelse = self.comp(node.orelse))

    def node_tryfinally(self, node):
        return TryFinally(body = self.comp(node.body), finalbody = self.comp(node.finalbody))

    def node_excepthandler(self, node):
        if node.name:
            nodename = self.comp(node.name)
        else:
            nodename = None

        if node.type:
            nodetype = self.comp(node.type)
        else:
            nodetype = None
        return TryHandler(body = self.comp(node.body), name = nodename, type = nodetype)

    def node_tuple(self, node):
        return Tuple(elts = self.comp(node.elts))

    def node_assign(self, node):
        return Assign(lvalue = self.comp(node.targets), rvalue = self.comp(node.value))

    def node_augassign(self, node):
        return AugAssign(target = self.comp(node.target), value = self.comp(node.value), op = node.op.__class__.__name__)

    def node_for(self, node):
        return ForEach(body = self.comp(node.body), iter = self.comp(node.iter), target = self.comp(node.target), orelse = self.comp(node.orelse))

    def node_classdef(self, node):
        return ClassDef(body = self.comp(node.body), name = node.name, decorators = self.comp(node.decorator_list), bases = self.comp(node.bases))

    def node_delete(self, node):
        return Delete(targets = self.comp(node.targets))
