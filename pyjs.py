#! /usr/bin/env python

import sys
import os.path
from optparse import OptionParser
from pyjaco import Compiler

def main():
    parser = OptionParser(usage="%prog [options] filename",
                          description="Python to JavaScript compiler.")

    parser.add_option("--output",
                      action="store",
                      dest="output",
                      help="write output to OUTPUT")

    parser.add_option("-i", "--include-builtins",
                      action="store_true",
                      dest="include_builtins",
                      default=False,
                      help="include py-builtins.js library in the output")

    parser.add_option("-I", "--import-builtins",
                      action="store_true",
                      dest="import_builtins",
                      default=False,
                      help="call load('py-builtins.js') to source the standard library")

    options, args = parser.parse_args()
    if len(args) == 1:
        filename = args[0]

        if options.output:
            output = open(options.output, "w")
        else:
            output = sys.stdout

        if options.include_builtins:
            if os.path.dirname(__file__):
                builtins = open(os.path.join(os.path.dirname(__file__), "py-builtins.js")).read()
            else:
                builtins = open("py-builtins.js").read()
            output.write(builtins)
        elif options.import_builtins:
            output.write('load("py-builtins.js");\n')

        c = Compiler()
        c.append_string(open(filename).read())
        output.write(str(c))
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
