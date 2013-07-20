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

class ISTNode(object):

    def __init__(self, **attr):
        for x in attr:
            if not x in self._fields:
                raise TypeError("IST node [%s] does not take attribute [%s]" % (self.__class__.__name__, x))
            else:
                setattr(self, x, attr[x])
        for x in self._fields:
            if not x in attr:
                raise TypeError("IST node [%s] requires attribute [%s]" % (self.__class__.__name__, x))


    def str(self, indent = 0):
        i = "  "*indent
        s = "%s%s: " % (i, self.__class__.__name__)
        i += "  "
        f = []
        for k in self._fields:
            v = getattr(self, k)
            if isinstance(v, list):
                s += "\n%s%s [" % (i, k)

                for l in v:
                    s += "\n%s" % (l.str(indent + 2))

                if v == []:
                    s += "]"
                else:
                    s += "\n%s]" % i
            else:
                if isinstance(v, ISTNode):
                    f = "%s = %s" % (k, v.str())
                else:
                    f = "%s = %s" % (k, v)
                s += "\n%s%s" % (i, f)
        return s

## Annotations

class Annotation(ISTNode):
    _fields = ["data"]

class Comment(Annotation):
    _fields = ["comment"]

class Code(ISTNode):
    _fields = []

class Block(Code):
    _fields = ["body"]

class Nop(Code):
    _fields = []

class Function(Code):
    _fields = ["name", "params", "body", "decorators"]

class Parameters(Code):
    _fields = ["args", "defaults", "kwargs", "varargs"]

## Statements

class Statement(Code):
    _fields = []

class If(Code):
    _fields = ["cond", "body", "orelse"]

class While(Code):
    _fields = ["conf", "body"]

class TryExcept(Code):
    _fields = ["body", "errorbody"]

class For(Code):
    _fields = ["body", "init", "cond", "incr"]

class ForEach(Code):
    _fields = ["body", "iter", "target", "orelse"]

class Raise(Code):
    _fields = ["expr"]

class Break(Code):
    _fields = []

class Continue(Code):
    _fields = []

class Return(Code):
    _fields = ["expr"]

class ClassDef(Code):
    _fields = ["body", "name", "bases", "decorators"]

## Expressions

class Call(Code):
    _fields = ["func", "params"]

class Assign(Code):
    _fields = ["lvalue", "rvalue"]

class BinOp(Code):
    _fields = ["left", "right", "op"]

class Value(Code):
    _fields = ["value"]

class GetAttr(Code):
    _fields = ["base", "attr"]

class Name(Code):
    _fields = ["id"]

class String(Code):
    _fields = ["value"]

class TryExcept(Code):
    _fields = ["body", "handlers", "orelse"]

class TryFinally(Code):
    _fields = ["body", "finalbody"]

class TryHandler(Code):
    _fields = ["body", "name", "type"]

class Tuple(Code):
    _fields = ["elts"]

class AugAssign(Code):
    _fields = ["target", "value", "op"]
