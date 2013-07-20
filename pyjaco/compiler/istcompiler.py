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
        return BoolOp(values = self.comp(node.values), op = node.op.__class__.__name__)

    def node_keyword(self, node):
        return node.arg, self.comp(node.value)

    def node_call(self, node):
        return Call(func     = self.comp(node.func), args = self.comp(node.args),
                    keywords = None if node.keywords is None else self.comp(node.keywords),
                    varargs  = None if node.starargs is None else self.comp(node.starargs),
                    kwargs   = None if node.kwargs   is None else self.comp(node.kwargs))

    def node_expr(self, node):
        return self.comp(node.value)

    def node_functiondef(self, node):
        return Function(body = [self.comp(n) for n in node.body], name = node.name, params = self.comp(node.args),
                        decorators = [self.comp(n) for n in node.decorator_list])

    def node_if(self, node):
        return If(cond = self.comp(node.test), body = self.comp(node.body), orelse = self.comp(node.orelse))

    def node_module(self, node):
        return [self.comp(n) for n in node.body]

    def node_name(self, node):
        return Name(id = node.id)

    def node_num(self, node):
        return Value(value = node.n)

    def node_print(self, node):
        assert node.dest == None
        assert node.nl

        return Call(func = GetAttr(base = self.bi, attr = "print"), args = [self.comp(n) for n in node.values],
                    keywords = None, varargs = None, kwargs = None)

    def node_return(self, node):
        if node.value:
            value = self.comp(node.value)
        else:
            value = None
        return Return(expr = value)

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
        return Tuple(values = self.comp(node.elts))

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

    def node_compare(self, node):
        return Compare(comps = self.comp(node.comparators), ops = [x.__class__.__name__ for x in node.ops], lvalue = self.comp(node.left))

    def node_subscript(self, node):
        return Subscript(value = self.comp(node.value), slice = self.comp(node.slice))

    def node_index(self, node):
        return Value(value = self.comp(node.value))

    def node_list(self, node):
        return List(values = self.comp(node.elts))

    def node_continue(self, node):
        return Continue()

    def node_break(self, node):
        return Break()

    def node_lambda(self, node):
        return Lambda(args = self.comp(node.args), body = self.comp(node.body))

    def node_unaryop(self, node):
        return UnaryOp(lvalue = self.comp(node.operand), op = node.op.__class__.__name__)

    def node_raise(self, node):
        assert node.inst is None
        assert node.tback is None
        if node.type:
            expr = self.comp(node.type)
        else:
            expr = None
        return Raise(expr = expr)

    def node_while(self, node):
        return While(cond = self.comp(node.test), body = self.comp(node.body), orelse = self.comp(node.orelse))

    def node_dict(self, node):
        return Dict(keys = self.comp(node.keys), values = self.comp(node.values))

    def node_global(self, node):
        return Global(names = node.names[:])

    def node_yield(self, node):
        return Yield(value = self.comp(node.value))

    def node_slice(self, node):
        if node.lower:
            lower = self.comp(node.lower)
        else:
            lower = None

        if node.upper:
            upper = self.comp(node.upper)
        else:
            upper = None

        if node.step:
            step = self.comp(node.step)
        else:
            step = None
        return Slice(lower = lower, upper = upper, step = step)

    def node_generatorexp(self, node):
        return Generator(value = self.comp(node.elt), generators = self.comp(node.generators))

    def node_comprehension(self, node):
        return Comprehension(conds = self.comp(node.ifs), iter = self.comp(node.iter), target = self.comp(node.target))

    def node_importfrom(self, node):
        assert node.level == 0
        names = dict()
        for n in node.names:
            names[n.name] = n.asname
        return ImportFrom(module = node.module, names = names)

    def node_import(self, node):
        names = dict()
        for n in node.names:
            names[n.name] = n.asname
        return Import(names = names)

    def node_listcomp(self, node):
        return List(values = [Generator(value = self.comp(node.elt), generators = self.comp(node.generators))])
