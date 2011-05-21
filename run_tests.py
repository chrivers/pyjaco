#! /usr/bin/env python

import os
import sys
import tempfile
import subprocess
from glob import glob
from optparse import OptionParser
from difflib import unified_diff

#PY_OUT_FILE_NAME = os.path.join(tempfile.gettempdir(), "py.out")
#JS_OUT_FILE_NAME = os.path.join(tempfile.gettempdir(), "js.out")
#JS_ERR_FILE_NAME = os.path.join(tempfile.gettempdir(), "js.err")
#JS_SRC_FILE_NAME = os.path.join(tempfile.gettempdir(), "js.src")
JS_DIFF_FILE_NAME = os.path.join(tempfile.gettempdir(), "js.diff")
#PY2JS_ERR_FILE_NAME = os.path.join(tempfile.gettempdir(), "py2js.err")

def proc_capture(args, stdin = None, encoding = 'utf-8', env = None):
    try:
        ## This can be important in CGI scripts, to ensure headers are passed correctly
        sys.stdout.flush()
        sys.stderr.flush()
        proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env = env)
        if stdin:
            if encoding:
                proc.stdin.write(stdin.encode(encoding))
            else:
                proc.stdin.write(stdin)
        proc.stdin.close()
        stdout = proc.stdout.readlines()
        stderr = proc.stderr.readlines()
        retcode = proc.wait()
        del proc
        return (retcode, "".join(stdout), "".join(stderr))
    except KeyboardInterrupt, e:
        sys.stdout.write("\r\n")
        raise e

def test1(in_file):
    w = Writer()
    w.write("Testing the file: %s" % in_file)
    r = os.system('js -f py-builtins.js -f \"%s\"' % in_file)
    w.check(r)

def test2(in_file):
    w = Writer()
    w.write("Testing the file: %s" % in_file)
    command = ""
    if sys.platform == "win32":
        command = "set "
    r = os.system("%sPYTHONPATH=.:$PYTHONPATH python \"%s\"" % (command,in_file))
    w.check(r)

def test3(name, in_file = None, known_to_fail = False, stop_on_error = True):

    in_file = in_file or name 

    PYTHON_COMMAND = "python \"%s\" "
    PY2JS_COMMAND = "python pyjs.py --include-builtins \"%s\" > \"%s\" 2> \"%s\""
    JS_COMMAND = "js -f \"%s\" > \"%s\" 2> \"%s\""
    DIFF_COMMAND = "diff \"%s\" \"%s\" > \"%s\""
    w = Writer()
    w.write("%s: " % name)

    r, stdout1, stderr = proc_capture(["python", in_file])
    w.write(".")
    if r == 0:
        r, stdout2, stderr = proc_capture(["python", "pyjs.py", "--include-builtin", in_file])
        w.write(".")
        if r == 0:
            r, stdout3, stderr = proc_capture(["js"], stdin = stdout2)
            w.write(".")
            if r == 0:
                f = file(JS_DIFF_FILE_NAME, "w")
                f.write(stdout3)
                f.close()
                r4, stdout4, stderr = proc_capture(["diff", JS_DIFF_FILE_NAME, "-"], stdin = stdout1)
                w.write(".")
    w.check(r, known_to_fail, stop_on_error, stderr)

def main():
    if not os.path.exists("py-builtins.js"):
        print "py-builtins.js not found. Run 'make' to generate it"
        return False

    parser = OptionParser(usage="%prog [options] filename",
        description="py2js tests.")

    parser.add_option("-a", "--run-all",
            action="store_true", dest="run_all",
            default=False, help="run all tests (including the known-to-fail)")

    parser.add_option("-f", "--only-failing",
            action="store_true", dest="only_failing",
            default=False, help="run only failing tests (to quickly check for improvements)")

    parser.add_option("-c", "--continue",
            action="store_false", dest="stop_on_errors",
            default=True, help="continue, even if a test fails")

    options, args = parser.parse_args()
    if len(args) == 1:
        test3(args[0])
    else:
        if not options.only_failing:
            test1("tests/test_builtins.js")
            files = glob("tests/test_*.py")
            for file in files:
                test2(file)

        dirs = [
            "tests/basic/*.py",
            "tests/errors/*.py",
            "tests/functions/*.py",
            "tests/lists/*.py",
            "tests/strings/*.py",
            "tests/algorithms/*.py",
                ]

        known_to_fail = [
                "tests/basic/super.py",
                "tests/basic/oo_diamond.py",
                "tests/basic/oo_super.py",
                "tests/basic/listcomp2.py",
                "tests/basic/del_local.py",
                "tests/basic/del_global.py",
                "tests/basic/generator.py",

                "tests/errors/decorator.py",
                ]
        failing = {}
        for f in known_to_fail:
            failing[f] = os.path.abspath(f)

        files = {}
        for dir in dirs:
            for path in glob(dir):
                files[path] = os.path.abspath(path)

        if options.only_failing:
            target = failing
        else:
            target = files

        for name in sorted(target):
            if options.run_all or options.only_failing:
                test3(name, target[name], name in known_to_fail, stop_on_error = options.stop_on_errors)
            elif name not in known_to_fail:
                test3(name, target[name], stop_on_error = options.stop_on_errors)

class Writer(object):

    def __init__(self):
        self._line_wrap = False
        self._write_pos = 0

    def write(self, text, color="", align="left", width=80):
        """
        Prints a text on the screen.

        It uses sys.stdout.write(), so no readline library is necessary.

        color ... choose from the colors below, "" means default color
        align ... left/right, left is a normal print, right is aligned on the
                  right hand side of the screen, filled with " " if necessary
        width ... the screen width
        """
        color_templates = (
            ("Black"       , "0;30"),
            ("Red"         , "0;31"),
            ("Green"       , "0;32"),
            ("Brown"       , "0;33"),
            ("Blue"        , "0;34"),
            ("Purple"      , "0;35"),
            ("Cyan"        , "0;36"),
            ("LightGray"   , "0;37"),
            ("DarkGray"    , "1;30"),
            ("LightRed"    , "1;31"),
            ("LightGreen"  , "1;32"),
            ("Yellow"      , "1;33"),
            ("LightBlue"   , "1;34"),
            ("LightPurple" , "1;35"),
            ("LightCyan"   , "1;36"),
            ("White"       , "1;37"),  )

        colors = {}

        for name, value in color_templates:
            colors[name] = value
        c_normal = '\033[0m'
        c_color = '\033[%sm'

        if align == "right":
            if self._write_pos+len(text) > width:
                # we don't fit on the current line, create a new line
                self.write("\n")
            self.write(" "*(width-self._write_pos-len(text)))

        if hasattr(sys.stdout, 'isatty') and not sys.stdout.isatty():
            # the stdout is not a terminal, this for example happens if the
            # output is piped to less, e.g. "bin/test | less". In this case,
            # the terminal control sequences would be printed verbatim, so
            # don't use any colors.
            color = ""
        if sys.platform == "win32":
            # Windows consoles don't support ANSI escape sequences
            color = ""

        if self._line_wrap:
            if text[0] != "\n":
                sys.stdout.write("\n")

        if color == "":
            sys.stdout.write(text)
        else:
            sys.stdout.write("%s%s%s" % (c_color % colors[color], text, c_normal))
        sys.stdout.flush()
        l = text.rfind("\n")
        if l == -1:
            self._write_pos += len(text)
        else:
            self._write_pos = len(text)-l-1
        self._line_wrap = self._write_pos >= width
        self._write_pos %= width

    def check(self, r, known_to_fail = False, stop_on_error = True, stderr = None):
        if r == 0:
            if known_to_fail:
                self.write("should fail but [OK]", align="right", color="Green")
            else:
                self.write("[OK]", align="right", color="Green")
        else:
            if known_to_fail:
                self.write("known to [FAIL]", align="right", color="Purple")
            else:
                self.write("[FAIL]", align="right", color="Red")

        if stderr:
            self.write(stderr)

        if r <> 0 and not known_to_fail and stop_on_error:
            sys.exit(1)

        self.write("\n")

if __name__ == '__main__':
    main()
