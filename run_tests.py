#! /usr/bin/env python

import os
import sys
from glob import glob
from difflib import unified_diff

def test1(in_file):
    w = Writer()
    w.write("Testint the file: %s" % in_file)
    out_file = "/tmp/_pyvascript_test.out"
    os.system("python %s > %s" % (in_file, out_file))
    out_file_correct = os.path.splitext(in_file)[0] + ".out"
    f1 = open(out_file_correct).read()
    f2 = open(out_file).read()
    if f1 == f2:
        w.write("[OK]", align="right", color="Green")
    else:
        w.write("[FAIL]", align="right", color="Red")
    w.write("\n")

def test2(in_file):
    w = Writer()
    w.write("Testint the file: %s" % in_file)
    r = os.system("python %s" % (in_file))
    if r == 0:
        w.write("[OK]", align="right", color="Green")
    else:
        w.write("[FAIL]", align="right", color="Red")
    w.write("\n")

def main():
    files = glob("examples/*.py")
    for file in files:
        test1(file)
    files = glob("tests/test_*.py")
    for file in files:
        test2(file)

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

main()
