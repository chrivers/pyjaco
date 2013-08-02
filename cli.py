#!/usr/bin/env python
import subprocess
import pyjaco
import ast
import select
from pyjaco import Compiler
import platform
import sys, os
import readline

debug = len(sys.argv) > 1 and sys.argv[1] == '-d'

compiler = Compiler()

def pyjaco_compile(code, printoutput):
    if printoutput:
        return "try {print($PY.repr(%s), '\\n')} finally {print('\\nMARK\\n')};\n" % "\n".join(compiler._compile(code).split("\n")[1:])[:-1]
    else:
        return "try {%s} finally {print('\\nMARK\\n')};\n" % "".join(compiler._compile(code).split("\n")[1:])

if not os.path.exists("py-builtins.js"):
    print "Standard library (py-builtins.js) not found. Please 'make stdlib'"
    sys.exit(1)

try:
    proc = subprocess.Popen("js", stdin = subprocess.PIPE, stdout = subprocess.PIPE)
except OSError, E:
    print "Could not execute 'js' javascript engine: %s" % E
    sys.exit(1)

proc.stdin.write("load('py-builtins.js');\n")
proc.stdin.write("print('MARK');\n");
while True:
    line = proc.stdout.readline()
    if line.endswith("MARK\n"):
        break

print "Python 2.x (pyjaco)"
print "[google v8] on %s" % platform.system()
print 'Type "help", "copyright", "credits" or "license" for more information.'

while True:
    try:
        lastline = raw_input(">>> ").rstrip()
        if lastline:
            code = lastline
            while True:
                tree = None
                try:
                    tree = ast.parse(code)
                except SyntaxError, E:
                    if not E.msg.startswith("unexpected EOF"):
                        print "SyntaxError in code: %s" % E.message

                linetype = type(tree.body[0]) if tree and tree.body else None

                if linetype in (ast.Expr, ast.Print, ast.Assign) or lastline == "":
                    break
                else:
                    while True:
                        lastline = raw_input("... ").rstrip()
                        code += "\n" + lastline
                        try:
                            tree = ast.parse(code)
                        except SyntaxError, E:
                            if not E.msg.startswith("unexpected EOF"):
                                print "SyntaxError in code: %s" % E.message
                        else:
                            if lastline == "":
                                break

            jscode = pyjaco_compile(code, printoutput = linetype in (ast.Expr, ))
            if debug:
                print "[v8 input] >>>%s<<<" % jscode.rstrip()
            proc.stdin.write(jscode)

            while True:
                output = proc.stdout.readline()
                if debug:
                    print "-[v8 reply] >>>%r<<<" % output
                if output.startswith("d8> "):
                    output = output[4:]

                if output == "\n":
                    continue
                # Some versions of the v8 shell produce spurious (but harmless) "undefined" messages
                elif output == "undefined\n":
                    continue
                elif output == "MARK\n":
                    proc.stdin.write("\nprint('\\nSENTINEL\\n');\n");
                    while True:
                        output = proc.stdout.readline()
                        if output.startswith("d8> "):
                            output = output[4:]

                        if debug:
                            print "--[v8 reply] >>>%r<<<" % output
                        if output == "SENTINEL\n":
                            break
                        # Some versions of the v8 shell produce spurious (but harmless) "undefined" messages
                        elif output == "undefined\n":
                            continue
                        elif output == "\n":
                            continue
                        else:
                            print "Error:", output,
                    break
                elif linetype in (ast.Expr, ast.Print) and output.rstrip(" \n") <> "None":
                    print output,

    except EOFError:
        print
        break
