/* TESTS for the py-builtins.js module */
load("py-builtins.js");

var DEBUG = false;

function test(code) {
    if (DEBUG) {
        var x = code.toString().replace(/\n\s*/g, " ");
        print("  ", x);
    }
    if (!code()) {
        throw py_builtins.AssertionError.PY$__call__("test failed: " + code);
    }
}

function raises(exc, code) {
    try {
        code();
    } catch (e) {
        var name = e.PY$__class__.PY$__name__;

        if (name == exc.PY$__name__) {
            return;
        } else {
            throw py_builtins.AssertionError.PY$__call__(name + " exception was thrown in " + code);
        }
    }

    throw py_builtins.AssertionError.PY$__call__("did not raise " + exc.PY$__name__ + " in " + code);
}

function test_dict() {
    var d = dict.PY$__call__();

    test(function() { return str.PY$__call__(d) == '{}' });
    test(function() { return len(d) == 0 });

    raises(py_builtins.KeyError, function() { d.PY$popitem() });

    raises(py_builtins.KeyError, function() { d.PY$pop(0) });
    raises(py_builtins.KeyError, function() { d.PY$__getitem__(_int.PY$__call__(0)) });
    raises(py_builtins.KeyError, function() { d.PY$__delitem__(0) });

    raises(py_builtins.KeyError, function() { d.PY$pop('a') });
    raises(py_builtins.KeyError, function() { d.PY$__getitem__('a') });
    raises(py_builtins.KeyError, function() { d.PY$__delitem__('a') });

    d.PY$__setitem__(0, 1);

    test(function() { return str.PY$__call__(d) == '{0: 1}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.PY$__getitem__(_int.PY$__call__(0)) == 1 });

    d.PY$__setitem__(0, 2);

    test(function() { return str.PY$__call__(d) == '{0: 2}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.PY$__getitem__(_int.PY$__call__(0)) == 2 });

    test(function() { return d.PY$pop(0) == 2 });
    test(function() { return len(d) == 0 });

    d = dict.PY$__call__({1: 6, 2: 8});
    test(function() { return str.PY$__call__(d) == '{1: 6, 2: 8}' });
    d = dict.PY$__call__(tuple.PY$__call__([tuple.PY$__call__([1, 6]), tuple.PY$__call__([2, 8])]));
    test(function() { return str.PY$__call__(d) == '{1: 6, 2: 8}' });
    d = dict.PY$__call__(tuple.PY$__call__([tuple.PY$__call__([1, "x"]), tuple.PY$__call__([2, "y"])]));
    // This will change when repr() is implemented:
    test(function() { return str.PY$__call__(d) == '{1: x, 2: y}' });

    d = dict.PY$__call__(tuple.PY$__call__([tuple.PY$__call__([1, str.PY$__call__("x")]), tuple.PY$__call__([2, str.PY$__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.PY$__call__(d) == '{1: x, 2: y}' });

    d = dict.PY$__call__(tuple.PY$__call__([tuple.PY$__call__(["a", str.PY$__call__("x")]), tuple.PY$__call__(["b", str.PY$__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.PY$__call__(d) == '{a: x, b: y}' });

    d = dict.PY$__call__(tuple.PY$__call__([tuple.PY$__call__([str.PY$__call__("a"), str.PY$__call__("x")]), tuple.PY$__call__([str.PY$__call__("b"), str.PY$__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.PY$__call__(d) == '{a: x, b: y}' });

    d = dict.PY$__call__(list.PY$__call__([list.PY$__call__([str.PY$__call__("a"), str.PY$__call__("x")]), list.PY$__call__([str.PY$__call__("b"), str.PY$__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.PY$__call__(d) == '{a: x, b: y}' });
}

function test_iter() {
    var a = [0, 1, 2];
    var i = iter.PY$__call__(a);

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });

    var d = dict.PY$__call__({0: 1, 1: 2, 2: 3});
    var i = iter.PY$__call__(d);

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var t = tuple.PY$__call__([7, 3, 5]);
    var i = iter.PY$__call__(t);

    test(function() { return i.PY$next() == 7 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 5 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var t = list.PY$__call__([7, 3, 5]);
    var i = iter.PY$__call__(t);

    test(function() { return i.PY$next() == 7 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 5 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var i = iter.PY$__call__(range(5));

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 4 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });
}

function test_tuple() {
    raises(py_builtins.TypeError, function() { tuple.PY$__call__(1, 2, 3) });

    var t = tuple.PY$__call__();

    test(function() { return str.PY$__call__(t) == '()' });
    test(function() { return len(t) == 0 });

    test(function() { return t.PY$__contains__(5) == False });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(0) });

    raises(py_builtins.TypeError, function() { t.PY$__setitem__(7, 0) });
    raises(py_builtins.TypeError, function() { t.PY$__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.PY$index(5) });
    test(function() { return t.PY$count(5) == 0 });

    test(function() { return hash(t) == 3430008 });

    var t = tuple.PY$__call__([1]);

    test(function() { return str.PY$__call__(t) == '(1,)' });
    test(function() { return len(t) == 1 });

    var t = tuple.PY$__call__([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str.PY$__call__(t) == '(3, 4, 5, 5, 4, 4, 1)' });
    test(function() { return len(t) == 7 });

    test(function() { return t.PY$__contains__(5) == True });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(0)) == 3 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(1)) == 4 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(2)) == 5 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(3)) == 5 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(4)) == 4 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(5)) == 4 });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(6)) == 1 });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(7) });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(8) });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-1)) == 1; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-2)) == 4; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-3)) == 4; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-4)) == 5; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-5)) == 5; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-6)) == 4; });
    test(function() { return t.PY$__getitem__(_int.PY$__call__(-7)) == 3; });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-8); });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-9); });

    raises(py_builtins.TypeError, function() { t.PY$__setitem__(7, 0); });
    raises(py_builtins.TypeError, function() { t.PY$__delitem__(7); });

    test(function() { return t.PY$index(5) == 2 });
    test(function() { return t.PY$count(5) == 2 });

    test(function() { return hash(t) == -2017591611 });

    t = tuple.PY$__call__([1, 2, 3, 4]);
    test(function() { return str.PY$__call__(t) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(t)) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(t)) == '[1, 2, 3, 4]' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(tuple.PY$__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(tuple.PY$__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(list.PY$__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(list.PY$__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(tuple.PY$__call__(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(tuple.PY$__call__(t)))) == '[1, 2, 3, 4]' })
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(list.PY$__call__(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(list.PY$__call__(t)))) == '[1, 2, 3, 4]' })
}

function test_list() {
    raises(py_builtins.TypeError, function() { list.PY$__call__(1, 2, 3) });

    var t = list.PY$__call__();

    test(function() { return str.PY$__call__(t) == '[]' });
    test(function() { return len(t) == 0 });

    test(function() { return t.PY$__contains__(5) == False });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(0) });

    raises(py_builtins.IndexError, function() { t.PY$__setitem__(7, 0) });
    raises(py_builtins.IndexError, function() { t.PY$__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.PY$index(5) });
    test(function() { return t.PY$count(5) == 0 });

    raises(py_builtins.AttributeError, function() { return hash(t) });

    var t = list.PY$__call__([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str.PY$__call__(t) == '[3, 4, 5, 5, 4, 4, 1]' });
    test(function() { return len(t) == 7 });

    test(function() { return t.PY$__contains__(5) == True });
    test(function() { return t.PY$__getitem__(0) == 3 });
    test(function() { return t.PY$__getitem__(1) == 4 });
    test(function() { return t.PY$__getitem__(2) == 5 });
    test(function() { return t.PY$__getitem__(3) == 5 });
    test(function() { return t.PY$__getitem__(4) == 4 });
    test(function() { return t.PY$__getitem__(5) == 4 });
    test(function() { return t.PY$__getitem__(6) == 1 });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(7) });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(8) });
    test(function() { return t.PY$__getitem__(-1) == 1 });
    test(function() { return t.PY$__getitem__(-2) == 4 });
    test(function() { return t.PY$__getitem__(-3) == 4 });
    test(function() { return t.PY$__getitem__(-4) == 5 });
    test(function() { return t.PY$__getitem__(-5) == 5 });
    test(function() { return t.PY$__getitem__(-6) == 4 });
    test(function() { return t.PY$__getitem__(-7) == 3 });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-8) });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-9) });

    raises(py_builtins.IndexError, function() { t.PY$__setitem__(7, 0) });
    raises(py_builtins.IndexError, function() { t.PY$__delitem__(7) });

    test(function() { return t.PY$index(5) == 2 });
    test(function() { return t.PY$count(5) == 2 });

    raises(py_builtins.AttributeError, function() { return hash(t) });

    t.PY$append(3);
    test(function() { return str.PY$__call__(t) == '[3, 4, 5, 5, 4, 4, 1, 3]' });

    t.PY$__setitem__(1, 3);
    test(function() { return str.PY$__call__(t) == '[3, 3, 5, 5, 4, 4, 1, 3]' });
    t.PY$__setitem__(7, 0);
    test(function() { return str.PY$__call__(t) == '[3, 3, 5, 5, 4, 4, 1, 0]' });
    t.PY$__delitem__(7);
    test(function() { return str.PY$__call__(t) == '[3, 3, 5, 5, 4, 4, 1]' });
    t.PY$__delitem__(1);
    test(function() { return str.PY$__call__(t) == '[3, 5, 5, 4, 4, 1]' });
    t.PY$__delitem__(1);
    test(function() { return str.PY$__call__(t) == '[3, 5, 4, 4, 1]' });
    t.PY$__delitem__(0);
    test(function() { return str.PY$__call__(t) == '[5, 4, 4, 1]' });
    raises(py_builtins.IndexError, function() { t.PY$__delitem__(4) });

    t.PY$__setitem__(0, 1);
    test(function() { return str.PY$__call__(t) == '[1, 4, 4, 1]' });
    t.PY$__setitem__(1, 2);
    test(function() { return str.PY$__call__(t) == '[1, 2, 4, 1]' });
    t.PY$__setitem__(2, 3);
    test(function() { return str.PY$__call__(t) == '[1, 2, 3, 1]' });
    t.PY$__setitem__(3, 4);
    test(function() { return str.PY$__call__(t) == '[1, 2, 3, 4]' });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(4, 5) });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(5, 6) });
    t.PY$__setitem__(-1, 1);
    test(function() { return str.PY$__call__(t) == '[1, 2, 3, 1]' });
    t.PY$__setitem__(-2, 2);
    test(function() { return str.PY$__call__(t) == '[1, 2, 2, 1]' });
    t.PY$__setitem__(-3, 3);
    test(function() { return str.PY$__call__(t) == '[1, 3, 2, 1]' });
    t.PY$__setitem__(-4, 4);
    test(function() { return str.PY$__call__(t) == '[4, 3, 2, 1]' });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(-5, 5) });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(-6, 6) });


    t = list.PY$__call__([1, 2, 3, 4]);
    test(function() { return str.PY$__call__(t) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(t)) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(t)) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(tuple.PY$__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(tuple.PY$__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(list.PY$__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(list.PY$__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(tuple.PY$__call__(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(tuple.PY$__call__(t)))) == '[1, 2, 3, 4]' });
    test(function() { return str.PY$__call__(tuple.PY$__call__(iter.PY$__call__(list.PY$__call__(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str.PY$__call__(list.PY$__call__(iter.PY$__call__(list.PY$__call__(t)))) == '[1, 2, 3, 4]' });

    t = list.PY$__call__([]);
    test(function() { return str.PY$__call__(t) == '[]' });
    t.PY$append(1);
    test(function() { return str.PY$__call__(t) == '[1]' });
    t.PY$append(5);
    test(function() { return str.PY$__call__(t) == '[1, 5]' });
    test(function() { return t.PY$pop() == 5 });
    test(function() { return str.PY$__call__(t) == '[1]' });
    test(function() { return t.PY$pop() == 1 });
    test(function() { return str.PY$__call__(t) == '[]' });
    raises(py_builtins.IndexError, function() { t.PY$pop() });

    t = list.PY$__call__([4, 3, 1, 2]);
    test(function() { return str.PY$__call__(t) == '[4, 3, 1, 2]' });
    t.PY$remove(3);
    test(function() { return str.PY$__call__(t) == '[4, 1, 2]' });
    raises(py_builtins.ValueError, function() { t.PY$remove(3) });
    t.PY$remove(4);
    test(function() { return str.PY$__call__(t) == '[1, 2]' });
    t.PY$remove(2);
    test(function() { return str.PY$__call__(t) == '[1]' });
    t.PY$remove(1);
    test(function() { return str.PY$__call__(t) == '[]' });
    raises(py_builtins.ValueError, function() { t.PY$remove(3) });

    var t1 = tuple.PY$__call__([1, 2]);
    var t2 = tuple.PY$__call__([1, 3]);
    t = list.PY$__call__([t1, t2]);
    test(function() { return str.PY$__call__(t) == '[(1, 2), (1, 3)]' });
    test(function() { return t.PY$index(t1) == 0 });
    test(function() { return t.PY$index(t2) == 1 });
    test(function() { return t.PY$index(tuple.PY$__call__([1, 2])) == 0 });
    test(function() { return t.PY$index(tuple.PY$__call__([1, 3])) == 1 });
}

function test_range() {
    // Test tuple/list conversion from range()
    var t = tuple.PY$__call__(range(5));
    test(function() { return str.PY$__call__(t) == '(0, 1, 2, 3, 4)' });
    var t = list.PY$__call__(range(5));
    test(function() { return str.PY$__call__(t) == '[0, 1, 2, 3, 4]' });

    // test min/max/step in range():
    t = list.PY$__call__(range(1, 3));
    test(function() { return str.PY$__call__(t) == '[1, 2]' });
    t = list.PY$__call__(range(1, 5, 2));
    test(function() { return str.PY$__call__(t) == '[1, 3]' });

    // test iter:
    var t = list.PY$__call__(iter.PY$__call__(range(5)));
    test(function() { return str.PY$__call__(t) == '[0, 1, 2, 3, 4]' });
}

function test_map() {
    var f = function(x) { return x*x };
    var a = list.PY$__call__([1, 2, 3]);

    test(function() { return str.PY$__call__(map(f, list.PY$__call__())) == '[]' });
    test(function() { return str.PY$__call__(map(f, a)) == '[1, 4, 9]' });

    raises(py_builtins.TypeError, function() { map(f) });
    raises(py_builtins.NotImplementedError, function() { map(f, a, a) });
}

function test_zip() {
    test(function() { return str.PY$__call__(zip()) == "[]" });

    var a = list.PY$__call__([1, 2, 3]);
    var b = list.PY$__call__([4, 5, 6]);
    var c = list.PY$__call__([7, 8, 9]);

    test(function() { return str.PY$__call__(zip(a)) == "[(1,), (2,), (3,)]" });
    test(function() { return str.PY$__call__(zip(a,b)) == "[(1, 4), (2, 5), (3, 6)]" });
    test(function() { return str.PY$__call__(zip(a,b,c)) == "[(1, 4, 7), (2, 5, 8), (3, 6, 9)]" });

    var d = list.PY$__call__([7, 8, 9, 10]);
    var e = list.PY$__call__([7, 8, 9, 10, 11]);

    test(function() { return str.PY$__call__(zip(a,d)) == "[(1, 7), (2, 8), (3, 9)]" });
    test(function() { return str.PY$__call__(zip(d,a)) == "[(7, 1), (8, 2), (9, 3)]" });

    test(function() { return str.PY$__call__(zip(e,d)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });
    test(function() { return str.PY$__call__(zip(d,e)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });

    test(function() { return str.PY$__call__(zip(e,a,d)) == "[(7, 1, 7), (8, 2, 8), (9, 3, 9)]" });
    test(function() { return str.PY$__call__(zip(e,d,a)) == "[(7, 7, 1), (8, 8, 2), (9, 9, 3)]" });
}

function test_isinstance() {
    test(function() {
        return isinstance(py_builtins.StopIteration.PY$__call__(), py_builtins.StopIteration) == True;
    });

    test(function() {
        return isinstance(py_builtins.StopIteration.PY$__call__(), py_builtins.ValueError) == False;
    });

    test(function() { return isinstance([], tuple.PY$__call__()) == False });

    var t = tuple.PY$__call__([1, 2, 3]);

    test(function() { return isinstance(t, Array) == False });
    test(function() { return isinstance(t, Number) == False });
    test(function() { return isinstance(t, String) == False });

    test(function() { return isinstance(t, tuple.PY$__call__()) == False });

    test(function() { return isinstance(t, tuple.PY$__call__([Number, Array])) == False });
    test(function() { return isinstance(t, tuple.PY$__call__([Array, Number])) == False });

    test(function() { return isinstance(t, tuple.PY$__call__([Number, String])) == False });

    test(function() { return isinstance(t, tuple) == True });
    test(function() { return isinstance(t, list) == False });
    test(function() { return isinstance(t, dict) == False });

    test(function() { return isinstance(t, tuple.PY$__call__([list, dict])) == False });
}

function test_exceptions() {
    var e = py_builtins.NotImplementedError.PY$__call__('not implemented');

    test(function() { return e.PY$__class__.PY$__name__ == 'NotImplementedError' });
    test(function() { return e.PY$message == 'not implemented' });

    var e = py_builtins.ZeroDivisionError.PY$__call__('division by zero');

    test(function() { return e.PY$__class__.PY$__name__ == 'ZeroDivisionError' });
    test(function() { return e.PY$message == 'division by zero' });

    var e = py_builtins.AssertionError.PY$__call__('assertion error');

    test(function() { return e.PY$__class__.PY$__name__ == 'AssertionError' });
    test(function() { return e.PY$message == 'assertion error' });

    var e = py_builtins.AttributeError.PY$__call__('attribute error');

    test(function() { return e.PY$__class__.PY$__name__ == 'AttributeError' });
    test(function() { return e.PY$message == 'attribute error' });

    var e = py_builtins.RuntimeError.PY$__call__('runtime error');

    test(function() { return e.PY$__class__.PY$__name__ == 'RuntimeError' });
    test(function() { return e.PY$message == 'runtime error' });

    var e = py_builtins.ImportError.PY$__call__('import error');

    test(function() { return e.PY$__class__.PY$__name__ == 'ImportError' });
    test(function() { return e.PY$message == 'import error' });

    var e = py_builtins.TypeError.PY$__call__('type error');

    test(function() { return e.PY$__class__.PY$__name__ == 'TypeError' });
    test(function() { return e.PY$message == 'type error' });

    var e = py_builtins.ValueError.PY$__call__('value error');

    test(function() { return e.PY$__class__.PY$__name__ == 'ValueError' });
    test(function() { return e.PY$message == 'value error' });

    var e = py_builtins.NameError.PY$__call__('name error');

    test(function() { return e.PY$__class__.PY$__name__ == 'NameError' });
    test(function() { return e.PY$message == 'name error' });

    var e = py_builtins.IndexError.PY$__call__('index error');

    test(function() { return e.PY$__class__.PY$__name__ == 'IndexError' });
    test(function() { return e.PY$message == 'index error' });

    var e = py_builtins.KeyError.PY$__call__('key error');

    test(function() { return e.PY$__class__.PY$__name__ == 'KeyError' });
    test(function() { return e.PY$message == 'key error' });

    var e = py_builtins.StopIteration.PY$__call__('stop iteration');

    test(function() { return e.PY$__class__.PY$__name__ == 'StopIteration' });
    test(function() { return e.PY$message == 'stop iteration' });
}

function test_slice() {
    var s = slice.PY$__call__(3);
    test(function() { return s.start == null });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple.PY$__call__([0, 3, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple.PY$__call__([0, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple.PY$__call__([0, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple.PY$__call__([0, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple.PY$__call__([0, 0, 1])) });

    var t = tuple.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8, 9, 10])) });
    t = tuple.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8, 9])) });
    t = tuple.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8])) });
    t = list.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8, 9, 10])) });
    t = list.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8, 9])) });
    t = list.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8])) });

    s = slice.PY$__call__(null);
    test(function() { return s.start == null });
    test(function() { return s.stop == null });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple.PY$__call__([0, 10, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple.PY$__call__([0, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple.PY$__call__([0, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple.PY$__call__([0, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple.PY$__call__([0, 0, 1])) });

    var t = tuple.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8, 9, 10, 11, 12])) });
    t = tuple.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8, 9])) });
    t = tuple.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([8])) });
    t = list.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8, 9, 10, 11, 12])) });
    t = list.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8, 9])) });
    t = list.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([8])) });

    s = slice.PY$__call__(1, 3);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple.PY$__call__([1, 3, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple.PY$__call__([1, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple.PY$__call__([1, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple.PY$__call__([1, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple.PY$__call__([0, 0, 1])) });

    t = tuple.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([9, 10])) });
    t = tuple.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([9])) });
    t = tuple.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([])) });
    t = list.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([9, 10])) });
    t = list.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([9])) });
    t = list.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([])) });

    s = slice.PY$__call__(1, 10, 2);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 10 });
    test(function() { return s.step == 2 });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple.PY$__call__([1, 10, 2])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple.PY$__call__([1, 3, 2])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple.PY$__call__([1, 2, 2])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple.PY$__call__([1, 1, 2])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple.PY$__call__([0, 0, 2])) });

    t = tuple.PY$__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([9, 11, 13])) });
    t = tuple.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([9, 11])) });
    t = tuple.PY$__call__([8, 9, 10]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([9])) });
    t = tuple.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([])) });
    t = list.PY$__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([9, 11, 13])) });
    t = list.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([9, 11])) });
    t = list.PY$__call__([8, 9, 10]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([9])) });
    t = list.PY$__call__([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([])) });

    s = slice.PY$__call__(4, 6, 1);
    test(function() { return s.start == 4 });
    test(function() { return s.stop == 6 });
    test(function() { return s.step == 1 });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple.PY$__call__([4, 6, 1])) });
    test(function() { return s.PY$indices(6).PY$__eq__(tuple.PY$__call__([4, 6, 1])) });
    test(function() { return s.PY$indices(5).PY$__eq__(tuple.PY$__call__([4, 5, 1])) });
    test(function() { return s.PY$indices(4).PY$__eq__(tuple.PY$__call__([4, 4, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple.PY$__call__([3, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple.PY$__call__([2, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple.PY$__call__([1, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple.PY$__call__([0, 0, 1])) });

    t = tuple.PY$__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([12, 13])) });
    t = tuple.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([12])) });
    t = tuple.PY$__call__([8, 9, 10, 11]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([])) });
    t = tuple.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple.PY$__call__([])) });
    t = list.PY$__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([12, 13])) });
    t = list.PY$__call__([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([12])) });
    t = list.PY$__call__([8, 9, 10, 11]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([])) });
    t = list.PY$__call__([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list.PY$__call__([])) });

    s = slice.PY$__call__(0, -20);
    test(function() { return s.start == 0 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(50).PY$__eq__(tuple.PY$__call__([0, 30, 1])) });
    test(function() { return s.PY$indices(40).PY$__eq__(tuple.PY$__call__([0, 20, 1])) });
    test(function() { return s.PY$indices(21).PY$__eq__(tuple.PY$__call__([0, 1, 1])) });
    test(function() { return s.PY$indices(20).PY$__eq__(tuple.PY$__call__([0, 0, 1])) });

    s = slice.PY$__call__(-3, -20);
    test(function() { return s.start == -3 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(50).PY$__eq__(tuple.PY$__call__([47, 30, 1])) });
    test(function() { return s.PY$indices(40).PY$__eq__(tuple.PY$__call__([37, 20, 1])) });
    test(function() { return s.PY$indices(21).PY$__eq__(tuple.PY$__call__([18, 1, 1])) });
    test(function() { return s.PY$indices(20).PY$__eq__(tuple.PY$__call__([17, 0, 1])) });
}

function test_to_js() {
    var t = js(tuple.PY$__call__([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(list.PY$__call__([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(dict.PY$__call__({1: "s", 2: 3}));
    test(function() { return t[1] == "s" });
    test(function() { return t[2] == 3 });

    var t = js(tuple.PY$__call__([1, "s", dict.PY$__call__({1: "s", 2: 3})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });

    var t = js(tuple.PY$__call__([1, "s", dict.PY$__call__({1: "s", 2: 3, "x": tuple.PY$__call__([8, 9])})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });
    test(function() { return t[2]["x"][0] == 8 });
    test(function() { return t[2]["x"][1] == 9 });
}

function test_str() {
    var s = str.PY$__call__("some testing string");
    test(function() { return len(s) == 19 });
    test(function() { return s.PY$__getitem__(0) == "s" });
    test(function() { return s.PY$__getitem__(1) == "o" });
    test(function() { return s.PY$__getitem__(2) == "m" });
    test(function() { return s.PY$__getitem__(3) == "e" });
    test(function() { return s.PY$__getitem__(4) == " " });
    test(function() { return s.PY$__getitem__(5) == "t" });
    raises(py_builtins.TypeError, function() { s.PY$__setitem__(5, 3) });
    raises(py_builtins.TypeError, function() { s.PY$__delitem__(5) });

    test(function() { return s.PY$__getitem__(slice.PY$__call__(3, 6)) == "e t" });
    test(function() { return s.PY$__getitem__(slice.PY$__call__(1, 3)) == "om" });
    test(function() { return s.PY$__getitem__(slice.PY$__call__(1, null)) == "ome testing string" });
    test(function() { return s.PY$__getitem__(slice.PY$__call__(null, 3)) == "som" });
    test(function() { return s.PY$__getitem__(slice.PY$__call__(3)) == "som" });
    test(function() { return s.PY$__getitem__(slice.PY$__call__(1, 8, 2)) == "oets" });

    test(function() { return s.PY$count("t") == 3 });
    test(function() { return s.PY$count("e") == 2 });
    test(function() { return s.PY$count("m") == 1 });
    test(function() { return s.PY$count("3") == 0 });

    test(function() { return s.PY$index("t") == 5 });
    test(function() { return s.PY$index("e") == 3 });
    test(function() { return s.PY$index("m") == 2 });
    raises(py_builtins.ValueError, function() { s.PY$index("3") });

    test(function() { return s.PY$find("t") == 5 });
    test(function() { return s.PY$find("e") == 3 });
    test(function() { return s.PY$find("m") == 2 });
    test(function() { return s.PY$find("3") == -1 });

    test(function() { return s.PY$find("test") == 5 });
    test(function() { return s.PY$find("testi") == 5 });
    test(function() { return s.PY$find("testix") == -1 });

    var t = tuple.PY$__call__(["a", "b", "c"]);
    test(function() { return t.PY$__contains__("a") == True });
    test(function() { return t.PY$__contains__("b") == True });
    test(function() { return t.PY$__contains__("c") == True });
    test(function() { return t.PY$__contains__("d") == False });
    test(function() { return t.PY$__contains__(88) == False });

    var t = tuple.PY$__call__([str.PY$__call__("a"), str.PY$__call__("b"), str.PY$__call__("c")]);
    test(function() { return t.PY$__contains__("a") == True });
    test(function() { return t.PY$__contains__("b") == True });
    test(function() { return t.PY$__contains__("c") == True });
    test(function() { return t.PY$__contains__("d") == False });
    test(function() { return t.PY$__contains__(88) == False });
    test(function() { return t.PY$__contains__(str.PY$__call__("a")) == True });
    test(function() { return t.PY$__contains__(str.PY$__call__("b")) == True });
    test(function() { return t.PY$__contains__(str.PY$__call__("c")) == True });
    test(function() { return t.PY$__contains__(str.PY$__call__("d")) == False });
}

function tests() {
    print("");
    print("Testing dictionaries");
    test_dict();
    print("Testing iterators");
    test_iter();
    print("Testing tuples");
    test_tuple();
    print("Testing lists");
    test_list();
    print("Testing range()");
    test_range();
    print("Testing map()");
    test_map();
    print("Testing zip()");
    test_zip();
    print("Testing isinstance()");
    test_isinstance();
    print("Testing exceptions");
    test_exceptions();
    print("Testing slices");
    test_slice();
    print("Testing javascript conversion");
    test_to_js();
    print("Testing strings");
    test_str();
}

tests();
