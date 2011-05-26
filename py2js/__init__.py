import py2js.compiler.python
import py2js.compiler.javascript
import py2js.compiler.multiplexer
import re
import StringIO
import ast
import inspect

def compile(script, jsvars = None):
    c = Compiler(jsvars)
    c.append_string(script)
    return str(c)

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
        self.reset()

    def reset(self):
        self.buffer = StringIO.StringIO()

    def __str__(self):
        return self.buffer.getvalue()

    def dedent(self, code, body):
        code = [x for x in code.split("\n") if x != "" and not re.match(self.re_comment, x)]
        if len(code) < 1:
            return code.lstrip()

        if body:
            if code[0].lstrip().startswith('def'):
                code.pop(0)

        dedent = len(code[0]) - len(code[0].lstrip())
        res = []
        for c in code:
            res.append(c[dedent:])

        return "\n".join(res)

    def format_name(self, name):
        return "/*%s*/\n" % ("| %s |" % name).center(80, "*")

    def comment_section(self, name):
        if name:
            self.buffer.write(self.format_name(name))

    def append_raw(self, code, name = None):
        self.comment_section(name)
        self.buffer.write(code)
        self.buffer.write("\n\n")

    def append_string(self, code, name = None):
        self.comment_section(name)
        self.buffer.write("\n".join(self.compiler.visit(ast.parse(code))))
        self.buffer.write("\n\n")

    def append_method(self, code, name = None, body = False):
        self.append_string(self.dedent(inspect.getsource(code), body), name)

    def append_class(self, code, name = None):
        self.append_string(inspect.getsource(code), name)

    def compile_string(self, code, name = None):
        if name:
            name = self.format_name(name)
        else:
            name = ""
        return name + "\n".join(self.compiler.visit(ast.parse(code)))

    def compile_method(self, code, name = None, body = False):
        return self.compile_string(self.dedent(inspect.getsource(code), body), name)

    def compile_class(self, code, name = None):
        return self.compile_string(inspect.getsource(code), name)

