######################################################################
##
## Copyright 2012 Christian Iversen <ci@sikkerhed.org>
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

    bi = "__builtins__"

    def __init__(self):
        pass

    def compile(self, source, filename = "<unknown>"):
        code = ast.parse(source, filename)
        
        return self.comp(code)

    def comp(self, node):
        name = "comp_%s" % node.__class__.__name__.lower()
        if hasattr(self, name):
            return getattr(self, name)(node)
        else:
            raise NotImplementedError("IST Compiler does not support node type [%s]" % node.__class__.__name__)

    def comp_module(self, node):
        return Block(body = [self.comp(n) for n in node.body])

    def comp_functiondef(self, node):
        return Function(body = [self.comp(n) for n in node.body], name = node.name, params = [])

    def comp_print(self, node):
        assert node.dest == None
        assert node.nl

        return Call(func = GetAttr(base = self.bi, attr = "print"), params = [self.comp(n) for n in node.values])

    def comp_binop(self, node):
        return BinOp(left = self.comp(node.left), right = self.comp(node.right), op = node.op.__class__.__name__)

    def comp_name(self, node):
        return Name(id = node.id)
