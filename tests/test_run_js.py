import os

from test_compile_js import f1, f2, f3

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
test(f3, "assert(f3(3) == -1)")
