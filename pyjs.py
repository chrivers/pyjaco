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

    parser.add_option("-o", "--output",
                      action = "store",
                      dest   = "output",
                      help   = "write output to OUTPUT, can be a file or directory")

    parser.add_option("-b", "--builtins",
            action = "store",
            dest = "builtins",
            choices = ["include", "import", "generate", "none"],
            default = "none")

    options, args = parser.parse_args()

    if len(args) == 1:
        filename = args[0]

        if options.output:
            if os.path.isdir(options.output):
                output_filename = os.path.splitext(os.path.basename(filename))[0]
                output_filename += ".js"
                output = open(os.path.join(options.output, output_filename), "w")
            else:
                output = open(options.output, "w")
        else:
            output = sys.stdout

        if options.builtins in ("include", "generate"):
            builtins = open(path_library).read()
            output.write("/*%s*/\n" % "  Standard library  ".center(76, "*"))
            output.write(builtins)
            output.write("/*%s*/\n" % "  User code  ".center(76, "*"))
        elif options.builtins == "import":
            output.write('load("%s");\n' % path_library)

        c = Compiler()
        c.append_string(open(filename).read())
        output.write(str(c))
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
