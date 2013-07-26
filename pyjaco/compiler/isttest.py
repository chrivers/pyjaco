#!/usr/bin/env python
import istcompiler
import pyprinter
import jsprinter
import jsfier
import sys
import ist

if len(sys.argv) == 1:
    print "Usage: %s <file.py>" % sys.argv[0]
    sys.exit()

c = istcompiler.Compiler()
for arg in sys.argv[1:]:
    code = c.compile(file(arg).read(), "test.py")
    code = jsfier.Transformer().compute(code)
    print jsprinter.format(code)
