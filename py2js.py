#! /usr/bin/env python

from optparse import OptionParser
from compiler import convert_py2js

def main():
    parser = OptionParser(usage="%prog [options] filename",
        description="Python to JavaScript compiler.")
    parser.add_option("--include-builtins",
            action="store_true", dest="include_builtins",
            default=False, help="include py-builtins.js library in the output")
    options, args = parser.parse_args()
    if len(args) == 1:
        filename = args[0]
        s = open(filename).read() #unsafe for large files!
        builtins = open("py-builtins.js").read() # unsafe for large files!
        js = convert_py2js(s)
        if options.include_builtins:
            print builtins
        print js
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
