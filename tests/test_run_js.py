import os

from test_compile_js import (f1, f2, f3, f3b, f3c, f3d, f3e, f4, f5, ifs1,
        ifs2, ifs3, ifs4, loop1, tuple1, tuple2, tuple3, tuple4, tuple5,
        Class1, Class2, Class3)

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


test(f1, "assert(f1(3) == 3);")
test(f1, "assert(f1(3) != 4);")
test(f2, "assert(f2(3) == 8);")
test(f3, "assert(f3(3) == -1);")
test(f3b, "assert(f3b(3) == -1);")
#test(f3c, "assert(f3c(3) == -1);")
test(f3d, "assert(f3d(3) == 20);")
test(f3e, "assert(f3e(3) == 9);")
test(f4, "assert(f4(true) == 5);")
test(f4, "assert(f4(false) == 6);")
test(f5, "assert(f5(true) == 2);")
test(f5, "assert(f5(false) == 0);")

test(ifs1, "ifs1(1);")
test(ifs2, "ifs2(1);")
test(ifs3, "ifs3(1);")
test(ifs4, "ifs4(1);")

test(tuple1, "assert(tuple1(3) == 12);")
test(tuple2, "assert(tuple2(3) == 6);")
test(tuple2, "assert(tuple2(4) == 7);")
test(tuple3, "assert(tuple3() == 8);")
test(tuple4, "assert(tuple4(1) == 2);")
test(tuple4, "assert(tuple4(3) == 3);")
test(tuple4, "assert(tuple4(4) == 1);")
test(tuple4, "assert(tuple4(5) == 0);")
test(tuple5, "assert(tuple5(1) == 0);")
test(tuple5, "assert(tuple5(4) == 3);")

test(loop1, "assert(loop1(4) == 6);")

test(Class1, """\
a = Class1();
assert(a.test1() == 5);
""")
test(Class2, """\
a = Class2();
assert(a.test1() == 6);
""")
test(Class3, """\
a = Class3();
assert(a.test1(3) == 5);
assert(a.test2(3) == 6);
""")
