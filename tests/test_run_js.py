import os

from test_compile_js import (f1, f2, f3, f3b, f3c, f3d, f3e, f4, f5, ifs1,
        ifs2, ifs3, ifs4, loop1,
        tuple1, tuple2, tuple3, tuple4, tuple5, tuple6, tuple7, tuple8,
        tuple9, tuple10,
        dict1, dict2, dict3,
        list1, list2, list3, list4, list5, list6, list7, list8,
        Class1, Class2, Class3)

def test(func, run):
    run_file = "/tmp/run.js"
    defs = open("builtins.js").read()
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
test(tuple6, "assert(tuple6() == '(10, 11)');")
test(tuple7, "assert(tuple7() == '(8, 9, 10, 11)');")
test(tuple8, "assert(tuple8() == '(9, 11, 13)');")
test(tuple9, "assert(tuple9() == '(8, 9, 10, 11, 12, 13, 14)');")
test(tuple10, "assert(tuple10() == '(12, 13, 14)');")

test(list1, "assert(list1(4) == 10);")
test(list1, "assert(list1(5) == 11);")
test(list2, "assert(list2() == '[0, 1, 2, 3, 4]');")
test(list3, "assert(list3() == '[5, 1, 2, 3, 0]');")
test(list4, "assert(list4() == '[10, 11]');")
test(list5, "assert(list5() == '[8, 9, 10, 11]');")
test(list6, "assert(list6() == '[9, 11, 13]');")
test(list7, "assert(list7() == '[8, 9, 10, 11, 12, 13, 14]');")
test(list8, "assert(list8() == '[12, 13, 14]');")

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

test(dict1, "assert(dict1() == 2);")
test(dict2, "assert(dict2() == 7);")
test(dict3, "assert(dict3() == 7);")
