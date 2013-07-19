import istcompiler
import istprinter

c = istcompiler.Compiler()
code = c.compile(file("test.py").read(), "test.py")
print istprinter.format(code)
