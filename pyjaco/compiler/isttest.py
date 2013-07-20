import istcompiler
import istprinter
import sys

if len(sys.argv) == 1:
    print "Usage: %s <file.py>" % sys.argv[0]
    sys.exit()

c = istcompiler.Compiler()
for arg in sys.argv[1:]:
    code = c.compile(file(arg).read(), "test.py")
    print istprinter.format(code)
