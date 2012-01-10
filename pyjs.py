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

def run_once(input_filenames, options):
    '''Given the input filenames and collection of options, run the compilation
    step exactly once. Ignores the -w option. If the -w option is passed, then
    this function should be called each time a file changes.'''
    if options.builtins == "generate":
        if input_filenames and (not options.output or not os.path.isdir(options.output)):
            parser.error("--builtins=generate can only be used if --output is a directory or if no input files are specified")

        if options.output: 
            if os.path.isdir(options.output):
                builtin_filename = os.path.join(options.output, "py-builtins.js")
            else:
                builtin_filename = options.output
            builtin_output = open(builtin_filename, "w")
        else:
            builtin_output = sys.stdout

        builtins = BuiltinGenerator().generate_builtins()
        builtin_output.write(builtins)

    if len(input_filenames) == 1 and not os.path.isdir(input_filenames[0]):
        if not options.output:
            output = sys.stdout
        elif os.path.isdir(options.output):
            output_filename = os.path.splitext(os.path.basename(input_filenames[0]))[0]
            output_filename += ".js"
            output = open(os.path.join(options.output, output_filename), "w")
        else:
            output = open(options.output, "w")

        if not options.quiet:
            sys.stderr.write("[%s] compiling %s\n" % (datetime.datetime.now(), input_filenames[0]))
        with open(input_filenames[0]) as input:
            compile_file(input, output, options)
    else:
        if input_filenames and (not options.output or not os.path.isdir(options.output)):
            parser.error("--output must be a directory if the input file is a directory")

        if len(input_filenames) == 1: # input_filenames contains a directory
            input_filenames = [os.path.join(input_filenames[0], f) for f in os.listdir(input_filenames[0]
                ) if os.path.splitext(f)[1] in VALID_EXTENSIONS]

        for input_filename in input_filenames:
            output_filename = os.path.splitext(os.path.basename(input_filename))[0]
            output_filename += ".js"
            if not options.quiet:
                sys.stderr.write("[%s] compiling %s\n" % (datetime.datetime.now(), input_filename))
            with open(input_filename) as input:
                with open(os.path.join(options.output, output_filename), "w") as output:
                    compile_file(input, output, options)

class Monitor:
    '''Class to monitor for changes in a file or directory and recompile if
    they have changed.'''
    def __init__(self, input_filenames, options):
        self.input_filenames = input_filenames
        self.options = options
        self.reset_mtimes()

    def reset_mtimes(self):
        '''reset the modification times to a dict with empty values.'''
        self.mtimes = dict([(f, None) for f in self.filenames])

    @property
    def filenames(self):
        '''Return a list of filenames to be monitored. If the input_filenames
        contains specific files return a list containing those files. Otherwise
        if it is a directory, return the list of files in that directory that
        have .py or .pyjaco extensions.'''
        if len(self.input_filenames) > 1 or not os.path.isdir(self.input_filenames[0]):
            return self.input_filenames
        else: # a single argument containing a directory
            return [os.path.join(self.input_filenames[0], f
                ) for f in os.listdir(self.input_filenames[0]
                    ) if os.path.splitext(f)[1] in VALID_EXTENSIONS]

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

    def safe_run_once(self):
        '''Run once, catching any exceptions and printing them, but allowing
        the watcher to continue.'''
        try:
            run_once(self.input_filenames, self.options)
        except Exception as e:
            if not self.options.quiet:
                traceback.print_exc(file=sys.stderr)
                sys.stderr.write("\n")

    def run(self):
        self.safe_run_once()
        while True:
            if self.code_changed():
                self.safe_run_once()

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

    parser.add_option("-q", "--quiet",
            action = "store_true",
            help = "Do not print informative notes to stderr")

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

    if len(args) == 0 and options.builtins != "generate":
        parser.error("No input path specified. You must supply an input file, or pass --builtins=generate")
    elif len(args) > 1 and not os.path.isdir(options.output):
        parser.error("Multiple input arguments supplied, but output is not a directory.")
    else:
        for arg in args:
            if not os.path.exists(arg):
                parser.error("The input path '%s' does not point to a valid file or directory" % arg)

        if not options.watch:
            run_once(args, options)
        else:
            monitor = Monitor(args, options)
            monitor.run()

if __name__ == '__main__':
    main()
