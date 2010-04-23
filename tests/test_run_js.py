import os

from py2js import JavaScript

@JavaScript
def f1(x):
    return x

@JavaScript
def f2(x):
    return x + 5

@JavaScript
def f3(x):
    a = x + 1
    return a - 5



def test(func, run):
    run_file = "/tmp/run.js"
    defs = open("defs.js").read()
    with open(run_file, "w") as f:
        f.write(defs)
        f.write("\n")
        f.write(str(func))
        f.write("\n")
        f.write(run)
    r = os.system('js -f %s' % run_file)
    assert r == 0


test(f1, "assert(f1(3) == 3)")
test(f1, "assert(f1(3) != 4)")
test(f2, "assert(f2(3) == 8)")
