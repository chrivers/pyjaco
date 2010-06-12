#! /usr/bin/env python

import os
import sys
from glob import glob
from optparse import OptionParser
from difflib import unified_diff

def test1(in_file):
    w = Writer()
    w.write("Testing the file: %s" % in_file)
    r = os.system('js -f py-builtins.js -f %s' % in_file)
    w.check(r)

def test2(in_file):
    w = Writer()
    w.write("Testing the file: %s" % in_file)
    r = os.system("PYTHONPATH=.:$PYTHONPATH python %s" % (in_file))
    w.check(r)

def test3(in_file, known_to_fail=False):
    w = Writer()
    w.write("%s [4]: " % in_file)
    r = os.system("python %s > /tmp/py.out" % (in_file))
    w.write(".")
    if r == 0:
        r = os.system("python py2js.py --include-builtins %s > /tmp/js.src 2> /tmp/py2js.err" % (in_file))
        w.write(".")
        if r == 0:
            r = os.system("js -f /tmp/js.src > /tmp/js.out 2> /tmp/js.err")
            w.write(".")
            if r == 0:
                r = os.system("diff /tmp/js.out /tmp/py.out > /tmp/js.diff")
                w.write(".")
    w.check(r, known_to_fail)

def main():
    parser = OptionParser(usage="%prog [options] filename",
        description="py2js tests.")
    parser.add_option("-a", "--run-all",
            action="store_true", dest="run_all",
            default=False, help="run all tests (including the known-to-fail)")
    options, args = parser.parse_args()
    if len(args) == 1:
        test3(args[0])
    else:
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
        files = []
        for dir in dirs:
            files.extend(glob(dir))
        known_to_fail = [
                "tests/basic/nestedclass.py",
                "tests/basic/super.py",
                "tests/basic/class5.py",
                "tests/basic/kwargs.py",
                "tests/basic/float2int.py",
                "tests/basic/oo_inherit.py",
                "tests/basic/listcomp2.py",
                "tests/basic/del_dict.py",
                "tests/basic/del_local.py",
                "tests/basic/sumcomp.py",
                "tests/basic/del_array.py",
                "tests/basic/valueerror.py",
                "tests/basic/lambda.py",
                "tests/basic/try.py",
                "tests/basic/assign_slice.py",
                "tests/basic/vargs.py",
                "tests/basic/del_attr.py",
                "tests/basic/del_global.py",
                "tests/basic/del_slice.py",
                "tests/basic/generator.py",
                "tests/basic/raise.py",

                "tests/functions/sort_cmp.py",
                "tests/functions/ne.py",
                "tests/functions/aug.py",
                "tests/functions/floatdiv.py",
                "tests/functions/sort23.py",

                "tests/errors/decorator.py",

                "tests/lists/filter.py",
                "tests/lists/reduce.py",
                "tests/lists/sum.py",
                "tests/lists/subclass.py",

                "tests/strings/string_format_d.py",
                "tests/strings/string_format_efg.py",
                "tests/strings/string_format_i.py",
                "tests/strings/string_format_o.py",
                "tests/strings/string_format_u.py",
                "tests/strings/string_format_x.py",
                "tests/strings/ulcase.py",
                ]
        files.sort()
        for file in files:
            if options.run_all:
                test3(file, file in known_to_fail)
            elif file not in known_to_fail:
                test3(file)

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

    def check(self, r, known_to_fail=False, exit_on_failure=True):
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
                if exit_on_failure:
                    print
                    print
                    sys.exit(1)
        self.write("\n")

if __name__ == '__main__':
    main()
