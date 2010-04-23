import os

from py2js import JavaScript

def f1(x):
    return x

def f2(x):
    return x**2

def test(func, run):
    func_source = str(JavaScript(func))
    run_file = "/tmp/run.js"
    defs = open("defs.js").read()
    with open(run_file, "w") as f:
        f.write(defs)
        f.write("\n")
        f.write(func_source)
        f.write("\n")
        f.write(run)
    r = os.system('js -f %s' % run_file)
    assert r == 0


test(f1, "assert(f1(3) == 3)")
test(f1, "assert(f1(3) != 4)")
test(f2, "assert(f2(3) == 9)")
