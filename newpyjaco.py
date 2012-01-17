
import pyjaco.compiler.istcompiler
import inspect

c = pyjaco.compiler.istcompiler.Compiler()

def foo(x, y, z):
    print x + y * z

print c.compile(inspect.getsource(foo)).str()
