######################################################################
##
## Copyright 2011 Christian Iversen <ci@sikkerhed.org>
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

import pyjaco.compiler
import pyjaco.compiler.javascript
import pyjaco.compiler.python
import ast
from pyjaco.compiler import JSError

def dump(node):
    s = "%r -> %s" % (node, ast.dump(node))
    indent = 0
    buf = ""
    for c in s:
        buf += c
        if c == "(":
            indent += 2
            buf += "\n" + " " * indent
        elif c == "=":
            buf = buf[:-1]
            buf += " = "
#            buf += "\n" + " " * indent
        elif c == ")":
            indent -= 2
        elif c == ",":
            buf += "\n" + " " * (indent - 1)
#           buf += "\n" + " " * indent
    print buf

class Compiler(pyjaco.compiler.BaseCompiler):

    def __init__(self, jsvars, opts):
        super(Compiler, self).__init__(opts)
        self.comp_py = pyjaco.compiler.python.Compiler(opts)
        self.comp_js = pyjaco.compiler.javascript.Compiler(opts)

        self.visit_py = self.comp_py.visit
        self.visit_js = self.comp_js.visit
        self.visit_current = None

        self.comp_py.visit = self.visit
        self.comp_js.visit = self.visit

        self.modestack = []
        self.modecache = {}
        self.stack = []

        self.comp_py.stack = self.stack
        self.comp_js.stack = self.stack

        if jsvars:
            self.jsvars = jsvars[:]
        else:
            self.jsvars = []

        self.enter("py")

    def enter(self, mode):
        self.modestack.append(mode)
        if mode == "js":
            self.visit_current = self.visit_js
        elif mode == "py":
            self.visit_current = self.visit_py
        else:
            raise JSError("Trying to enter unsupported mode")

    def leave(self):
        self.modestack.pop()
        self.enter(self.modestack.pop())

    def visit(self, node, multiplex = True):
        self.stack.append(node.__class__.__name__)
        mode = self.get_mode(node)
        if mode:
            self.enter(mode)

        name = 'visit_' + self.name(node)
        if hasattr(self, name) and multiplex:
            res = getattr(self, name)(node)
        else:
            res = self.visit_current(node)

        if mode:
            self.leave()
        self.stack.pop()
        return res

    def get_mode(self, node):
        if not node in self.modecache:
            self.modecache[node] = self.get_mode_simple(node)
        return self.modecache[node]

    def get_mode_simple(self, node):
        if isinstance(node, ast.Call):
            return self.get_mode(node.func)

        elif isinstance(node, ast.Attribute):
            if isinstance(node.value, ast.Name):
                for x in self.jsvars:
                    if len(x) == 1 and node.value.id == x[0]:
                        return "js"
                    elif len(x) == 2 and node.value.id == x[0] and node.attr == x[1]:
                        return "js"
            else:
                return self.get_mode(node.value)

        elif isinstance(node, ast.Name):
            if node.id in [x[0] for x in self.jsvars]:
                return "js"
            else:
                return "py"

        elif isinstance(node, ast.Assign):
            return self.get_mode(node.targets[0])
        elif isinstance(node, ast.AugAssign):
            return self.get_mode(node.target)
        elif isinstance(node, ast.Subscript):
            return self.get_mode(node.value)

    def visit_Assign(self, node):
        return self.visit(node, False)

    def visit_FunctionDef(self, node):
        added = 0
        dec = node.decorator_list
        i = 0
        while i < len(dec):
            if isinstance(dec[i], ast.Call) and isinstance(dec[i].func, ast.Name) and dec[i].func.id == 'JSVar':
                for a in dec[i].args:
                    if isinstance(a, ast.Str):
                        self.jsvars.append(a.s.split("."))
                        added += 1
                    else:
                        raise JSError("JSVar decorator must only be used with string literals")
                del dec[i]
            else:
                i += 1
        res = self.visit(node, False)
        while added:
            self.jsvars.pop()
            added -= 1
        return res

    def visit_Return(self, node):
        return self.visit_current(node)

    def visit_AssignSimple(self, node):
        raise NotImplementedError()
