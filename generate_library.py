#!/usr/bin/env python

import glob
import os
import sys
import re

re_comment = re.compile("\s*//")
re_blank = re.compile("\s*$")

def strip_header(lines):
    for i, l in enumerate(lines):
        if l == "**/":
            return lines[i+1:]

def get_file(f):
    raw_lines = file(f).read().strip().split("\n")
    clean_lines = strip_header(raw_lines)
    res = []
    for l in clean_lines:
        if re_comment.match(l) or re_blank.match(l):
            continue
        res.append(l)
    res.append("\n")
    return "\n".join(res)

out = file("py-builtins.js", "w")

for f in sorted(glob.glob("library/*.js")):
    out.write("/* %-30s*/\n" % f)
    out.write(get_file(f))

out.close()
