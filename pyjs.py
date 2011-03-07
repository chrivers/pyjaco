#! /usr/bin/env python

import sys
import os.path
from optparse import OptionParser
from py2js import convert_py2js

def main():
    parser = OptionParser(usage="%prog [options] filename",
                          description="Python to JavaScript compiler.")

    parser.add_option("--output",
                      action="store",
                      dest="output",
                      help="write output to OUTPUT")

    parser.add_option("--include-builtins",
                      action="store_true",
                      dest="include_builtins",
                      default=False,
                      help="include py-builtins.js library in the output")

    options, args = parser.parse_args()
    if len(args) == 1:
        filename = args[0]

        if options.output:
            output = open(options.output, "w")
        else:
            output = sys.stdout

        if options.include_builtins:
            if os.path.dirname(__file__):
                builtins = open(os.path.join(os.path.dirname(__file__)), "py-builtins.js").read()
            else:
                builtins = open("py-builtins.js").read()
            output.write(builtins)

        s = open(filename).read() #unsafe for large files!
        output.write(convert_py2js(s))
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
