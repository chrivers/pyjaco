import os

from py2js import JavaScript

def f(x):
    return x

def test(func, run):
    func_source = str(JavaScript(func))
    run_file = "/tmp/run.js"
    with open(run_file, "w") as f:
        f.write(func_source)
        f.write("\n")
        f.write(run)
    r = os.system('js -f defs.js -f %s' % run_file)
    assert r == 0


test(f, "assert(f(3) == 3)")
test(f, "assert(f(3) != 4)")
