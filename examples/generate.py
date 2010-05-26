#! /usr/bin/env python

import os
from glob import glob

examples = glob("examples/*.py")
examples.remove("examples/generate.py")
print "Generating html"
for in_file in examples:
    print "  processing: ", in_file
    out_file = os.path.splitext(in_file)[0] + ".html"
    os.system("python %s > %s" % (in_file, out_file))
print "Done."
