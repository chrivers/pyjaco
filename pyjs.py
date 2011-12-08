#! /usr/bin/env python

import sys
import os.path
from optparse import OptionParser
from pyjaco import Compiler

if os.path.exists("py-builtins.js"):
    path_library = "py-builtins.js"
else:
    path_library = "/usr/share/pyjaco/py-builtins.js"

def main():
    parser = OptionParser(usage="%prog [options] filename",
                          description="Python to JavaScript compiler.")

    parser.add_option("--output",
                      action = "store",
                      dest   = "output",
                      help   = "write output to OUTPUT")

    parser.add_option("-i", "--include-builtins",
                      action  = "store_true",
                      dest    = "include_builtins",
                      default = False,
                      help    = "include py-builtins.js library in the output")

    parser.add_option("-I", "--import-builtins",
                      action  = "store_true",
                      dest    = "import_builtins",
                      default = False,
                      help    = "call load('py-builtins.js') to source the standard library")

    parser.add_option("-N", "--no-include",
                      action  = "store_true",
                      dest    = "no_builtins",
                      default = False,
                      help    = "Do not include attempt to load py-builtins.js. The generated javascript code will not run by itself, unless this library is included")

    options, args = parser.parse_args()

    if options.include_builtins + options.import_builtins + options.no_builtins <> 1 and len(args) == 1:
        print "You must specify either the -i, -I or -N mode!"
    elif len(args) == 1:
        filename = args[0]

        if options.output:
            output = open(options.output, "w")
        else:
            output = sys.stdout

        if options.include_builtins:
            builtins = open(path_library).read()
            output.write("/*%s*/\n" % "  Standard library  ".center(76, "*"))
            output.write(builtins)
            output.write("/*%s*/\n" % "  User code  ".center(76, "*"))
        elif options.import_builtins:
            output.write('load("%s");\n' % path_library)

        c = Compiler()
        c.append_string(open(filename).read())
        output.write(str(c))
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
