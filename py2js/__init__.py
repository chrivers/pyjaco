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

import py2js.compiler.python
import py2js.compiler.javascript
import py2js.compiler.multiplexer
import re
import StringIO
import ast
import inspect

def compile_string(script, jsvars = None):
    """Compile a python expression into javascript"""
    comp = Compiler(jsvars)
    comp.append_string(script)
    return str(comp)

class Compiler(object):
    """
    py2js: A python-to-javascript compiler

    Usage:

    c = Compiler()

    # Compile a str of python source code, with the section header "Shared code"
    c.append_string("function Q(id)\n{\n  return $(js(id))\n};", "Shared code")

    # Append a raw string to the output (no compilation performed)
    c.append_raw('{"foo": "bar"}')

    # Append an entire class, including all methods, with the section header "Class: My class"
    c.append_class(MyClass, "Class: MyClass")

    # Print the resulting code
    print str(c)
    """

    re_comment = re.compile("^[ ]*#")

    def __init__(self, jsvars = None):
        self.compiler = py2js.compiler.multiplexer.Compiler(jsvars)
        self.buffer = None
        self.reset()

    def reset(self):
        self.buffer = StringIO.StringIO()

    def __str__(self):
        return self.buffer.getvalue()

    def dedent(self, code, body):
        if body:
            if code[0].lstrip().startswith('def'):
                code.pop(0)

        dedent = len(code[0]) - len(code[0].lstrip())
        res = []
        for c in code:
            res.append(c[dedent:])

        return "\n".join(res)

    def find_js(self, names):
        js = []
        for x in names:
            l = x.lstrip()
            if l.startswith("@JSVar"):
                names = l[7:-1].split(",")
                for n in [n.strip()[1:-1] for n in names]:
                    js.append(n.split("."))
        return js

    def split(self, code):
        code = [x for x in code.split("\n") if x != "" and not re.match(self.re_comment, x)]

        decos, lines = [], []
        for i, x in enumerate(code):
            if not x.lstrip().startswith("@"):
                return self.find_js(code[:i]), code[i:]

    @staticmethod
    def format_name(name):
        return "/*%s*/\n" % ("| %s |" % name).center(80, "*")

    def comment_section(self, name):
        if name:
            self.buffer.write(self.format_name(name))

    def append_raw(self, code, name = None):
        self.comment_section(name)
        self.buffer.write(code)
        self.buffer.write("\n\n")

    def append_string(self, code, name = None, jsvars = None):
        self.comment_section(name)
        if jsvars:
            self.compiler.jsvars = jsvars
        self.buffer.write("\n".join(self.compiler.visit(ast.parse(code))))
        self.buffer.write("\n\n")
        self.compiler.jsvars = []

    def append_method(self, code, name = None, body = False):
        jsvars, code = self.split(inspect.getsource(code))
        self.append_string(self.dedent(code, body), name, jsvars)

    def append_class(self, code, name = None):
        self.append_string(inspect.getsource(code), name)

    def append_module(self, module, classes, name = None):
        self.append_raw(self.compile_module(module, classes, name))

    def compile_string(self, code, name = None, jsvars = None):
        if name:
            name = self.format_name(name)
        else:
            name = ""
        if jsvars:
            self.compiler.jsvars = jsvars
        res = name + "\n".join(self.compiler.visit(ast.parse(code)))
        self.compiler.jsvars = []
        return res

    def compile_method(self, code, name = None, body = False):
        jsvars, code = self.split(inspect.getsource(code))
        return self.compile_string(self.dedent(code, body), name, jsvars)

    def compile_class(self, code, name = None):
        return self.compile_string(inspect.getsource(code), name)

    def compile_module(self, module, classes, name = None):
        self.comment_section(name)
        res = ["var %s = object();" % module]
        for cls in classes:
            res.append(self.format_name("Class %s.%s" % (module, cls.__name__)))
            res.append("%s.%s = function() {" % (module, cls.__name__))
            res.append(self.compile_class(cls))
            res.append("return %s}();" % (cls.__name__))
            res.append("")
        return "\n".join(res)
