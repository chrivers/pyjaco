import istcompiler
import istprinter
import sys

if len(sys.argv) == 1:
    print "Usage: %s <file.py>" % sys.argv[0]
    sys.exit()

c = istcompiler.Compiler()
code = c.compile(file(sys.argv[1]).read(), "test.py")
print istprinter.format(code)
