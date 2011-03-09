import py2js
import py2js.compiler
import py2js.compiler.javascript
import py2js.compiler.python
import ast
import inspect
from py2js.compiler import JSError

def dump(node):
    s = ast.dump(node)
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

class Compiler(py2js.compiler.BaseCompiler):

    def __init__(self):
        self.comp_py = py2js.compiler.python.Compiler()
        self.comp_js = py2js.compiler.javascript.Compiler()

        self.visit_py = self.comp_py.visit
        self.visit_js = self.comp_js.visit

        self.comp_py.visit = self.visit
        self.comp_js.visit = self.visit

        self.modestack = []

        ## A hack to test out mode switching
        self.jsvars = ["jQuery"]

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

    def visit(self, node):
        name = 'visit_' + self.name(node)
        if hasattr(self, name):
            return getattr(self, name)(node)
        else:
            return self.visit_current(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            if node.func.id in self.jsvars:
                self.enter("js")
            else:
                self.enter("py")
        else:
            self.enter("py")

        res = self.visit_current(node)
        self.leave()
        return res

    def visit_Return(self, node):
        dump(node)
        print "#"*80
        return self.visit_current(node)
