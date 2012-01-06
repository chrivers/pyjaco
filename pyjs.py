#! /usr/bin/env python

import re
import sys
import os.path
import datetime
import time
import traceback
import pkg_resources
from optparse import OptionParser
from pyjaco import Compiler

# extensions of files that can be compiled to .js
VALID_EXTENSIONS = ['.py', '.pyjaco']

OPEN_COMMENT = re.compile("^\s*/\*")
CLOSE_COMMENT = re.compile(".*\*/\s*$")
COMMENT = re.compile("^\s*//")
BLANK = re.compile("^\s*$")

class BuiltinGenerator(object):
    def comment_stripper(self, lines):
        '''Generator that removes all javascript comment lines from a file.
        Takes a sequence of strings as input, generates a sequence of strings
        with comments stripped.
        
        Assumes multi-line comments start with /* and end with */ with no valid
        code other than whitespace before or after the opening and closing
        symbols. In other words, comments like this:

        alert('hello'); /* this is
        a multi line comment */ alert('world')

        would not have the comment stripped.
        '''
        in_multi_comment = False
        for line in lines:
            if in_multi_comment:
                if CLOSE_COMMENT.match(line):
                    in_multi_comment = False
            elif OPEN_COMMENT.match(line):
                in_multi_comment = True
            elif not BLANK.match(line) and not COMMENT.match(line):
                yield line

    def generate_builtins(self):
        '''Combine the builtins shipped with the pyjaco library into a single
        py-builtins.js file.'''
        builtin_lines = []
        js_filenames = sorted(
                [f for f in pkg_resources.resource_listdir("pyjaco", "stdlib") if f.endswith(".js")])
        for js_filename in js_filenames:
            builtin_lines.append("\n/* %-30s*/" % js_filename)
            lines = self.comment_stripper(pkg_resources.resource_string(
                "pyjaco", "stdlib/%s" % js_filename
                ).splitlines())
            builtin_lines.extend(lines)

        return "\n".join(builtin_lines)


def compile_file(infile, outfile, options):
    '''Compile a single python file object to a single javascript output file
    object'''
    if options.builtins == "include":
        builtins = BuiltinGenerator().generate_builtins()

        outfile.write("/*%s*/\n" % "  Standard library  ".center(76, "*"))
        outfile.write(builtins)
        outfile.write("/*%s*/\n" % "  User code  ".center(76, "*"))
    elif options.builtins == "import":
        outfile.write('load("py-builtins.js");\n')

    c = Compiler()
    c.append_string(infile.read())
    outfile.write(str(c))

def run_once(input_filename, options):
    '''Given the input filename and collection of options, run the compilation
    step exactly once. Ignores the -w option. If the -w option is passed, then
    this function should be called each time a file changes.'''
    sys.stderr.write("[%s] compiling %s\n" % (datetime.datetime.now(), input_filename))
    if options.builtins == "generate":
        if not options.output or not os.path.isdir(options.output):
            parser.error("--builtins=generate can only be used if --output is a directory")

        builtin_filename = os.path.join(options.output, "py-builtins.js")
        with open(builtin_filename, "w") as builtin_output:
            builtins = BuiltinGenerator().generate_builtins()
            builtin_output.write(builtins)

    if os.path.isdir(input_filename):
        if not options.output or not os.path.isdir(options.output):
            parser.error("--output must be a directory if the input file is a directory")

        input_filenames = [f for f in os.listdir(input_filename) if os.path.splitext(f)[1] in VALID_EXTENSIONS]
        for filename in input_filenames:
            output_filename = os.path.splitext(os.path.basename(filename))[0]
            output_filename += ".js"
            with open(os.path.join(input_filename, filename)) as input:
                with open(os.path.join(options.output, output_filename), "w") as output:
                    compile_file(input, output, options)

    else:
        if not options.output:
            output = sys.stdout
        elif os.path.isdir(options.output):
            output_filename = os.path.splitext(os.path.basename(input_filename))[0]
            output_filename += ".js"
            output = open(os.path.join(options.output, output_filename), "w")
        else:
            output = open(options.output, "w")

        with open(input_filename) as input:
            compile_file(input, output, options)

class Monitor:
    '''Class to monitor for changes in a file or directory and recompile if
    they have changed.'''
    def __init__(self, input_filename, options):
        self.input_filename = input_filename
        self.options = options
        self.reset_mtimes()

    def reset_mtimes(self):
        '''reset the modification times to a dict with empty values.'''
        self.mtimes = dict([(f, None) for f in self.filenames])

    @property
    def filenames(self):
        '''Return a list of filenames to be monitored. If the input_filename is a single
        file return a list containing that file. Otherwise if it is a directory, return
        the list of files in that directory that have .py or .pyjaco extensions.'''
        if os.path.isdir(self.input_filename):
            return [os.path.join(self.input_filename, f
                ) for f in os.listdir(self.input_filename) if os.path.splitext(f)[1] in VALID_EXTENSIONS]
        else:
            return [self.input_filename]

    def code_changed(self):
        '''Return True if the code has changed since the previous run of this
        method.'''
        filenames = self.filenames
        if len(filenames) != len(self.mtimes):
            # a file was added or deleted, therefore code has changed
            self.reset_mtimes()
            return True

        for filename in filenames:
            stat = os.stat(filename)
            mtime = stat.st_mtime
            mtime = mtime - stat.st_ctime if sys.platform == "win32" else mtime

            if self.mtimes.get(filename) == None:
                self.mtimes[filename] = mtime
                continue

            if mtime != self.mtimes[filename]:
                self.reset_mtimes()
                return True

        return False

    def run(self):
        run_once(self.input_filename, self.options)
        while True:
            if self.code_changed():
                try:
                    run_once(self.input_filename, self.options)
                except Exception as e:
                    traceback.print_exc(file=sys.stderr)

            time.sleep(1)

parser = OptionParser(usage="""%prog [options] <infile>
        
        where infile is the name of a file or directory to be compiled.
        If infile is a directory, all files in that directory that have
        an extension of .py or .pyjaco will be compiled to .js files
        in the output directory.""",
                      description="Python to JavaScript compiler.")


def main():
    parser.add_option("-o", "--output",
                      action = "store",
                      dest   = "output",
                      help   = "write output to OUTPUT, can be a file or directory")

    parser.add_option("-b", "--builtins",
            action = "store",
            dest = "builtins",
            choices = ["include", "import", "generate", "none"],
            default = "none",
            help = "INCLUDE builtins statically in each file\nIMPORT builtins using a load statement in each file\nGENERATE a separate file for builtins (output must be a directory)\nNONE don't include builtins")

    parser.add_option("-I", "--import",
            action = "store_const",
            const = "import",
            dest = "builtins",
            help = "IMPORT builtins using a load statement in each file\n\nThis is an alias for -b import")

    parser.add_option("-w", "--watch",
            action = "store_true",
            dest = "watch",
            default = False,
            help = "Watch the input files for changes and recompile. If the input file is a single file, watch it for changes and recompile. If a directory, recompile if any .py or .pyjaco files in the directory have changes.")

    options, args = parser.parse_args()

    if len(args) == 1:
        if not os.path.exists(args[0]):
            parser.error("The input path '%s' does not point to a valid file or directory" % args[0])

        if not options.watch:
            run_once(args[0], options)
        else:
            monitor = Monitor(args[0], options)
            monitor.run()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
