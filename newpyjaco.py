
import pyjaco.compiler.istcompiler
import inspect

c = pyjaco.compiler.istcompiler.Compiler()

def foo(x, y, z):
    print x + y * z
    if True and False:
        foo.bar.baz(17)
    return 42

print c.compile(inspect.getsource(foo)).str()
