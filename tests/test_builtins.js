/* TESTS for the py-builtins.js module */
load("py-builtins.js");

var DEBUG = false;

function test(code) {
    if (DEBUG) {
        var x = code.toString().replace(/\n\s*/g, " ");
        print("  ", x);
    }
    if (!code()) {
        throw py_builtins.AssertionError("test failed: " + code);
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
            throw py_builtins.AssertionError(name + " exception was thrown in " + code);
        }
    }

    throw py_builtins.AssertionError("did not raise " + exc.PY$__name__ + " in " + code);
}

function test_dict() {
    var d = dict();

    test(function() { return str(d) == '{}' });
    test(function() { return len(d) == 0 });

    raises(py_builtins.KeyError, function() { d.PY$popitem() });

    raises(py_builtins.KeyError, function() { d.PY$pop(0) });
    raises(py_builtins.KeyError, function() { d.PY$__getitem__(int(0)) });
    raises(py_builtins.KeyError, function() { d.PY$__delitem__(0) });

    raises(py_builtins.KeyError, function() { d.PY$pop('a') });
    raises(py_builtins.KeyError, function() { d.PY$__getitem__('a') });
    raises(py_builtins.KeyError, function() { d.PY$__delitem__('a') });

    d.PY$__setitem__(0, 1);

    test(function() { return str(d) == '{0: 1}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.PY$__getitem__(int(0)) == 1 });

    d.PY$__setitem__(0, 2);

    test(function() { return str(d) == '{0: 2}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.PY$__getitem__(int(0)) == 2 });

    test(function() { return d.PY$pop(0) == 2 });
    test(function() { return len(d) == 0 });

    d = dict({1: 6, 2: 8});
    test(function() { return str(d) == '{1: 6, 2: 8}' });
    d = dict(tuple([tuple([1, 6]), tuple([2, 8])]));
    test(function() { return str(d) == '{1: 6, 2: 8}' });
    d = dict(tuple([tuple([1, "x"]), tuple([2, "y"])]));
    // This will change when repr() is implemented:
    test(function() { return str(d) == '{1: x, 2: y}' });

    d = dict(tuple([tuple([1, str("x")]), tuple([2, str("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str(d) == '{1: x, 2: y}' });

    d = dict(tuple([tuple(["a", str("x")]), tuple(["b", str("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str(d) == '{a: x, b: y}' });

    d = dict(tuple([tuple([str("a"), str("x")]), tuple([str("b"), str("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str(d) == '{a: x, b: y}' });

    d = dict(list([list([str("a"), str("x")]), list([str("b"), str("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str(d) == '{a: x, b: y}' });
}

function test_iter() {
    var a = [0, 1, 2];
    var i = iter(a);

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });

    var d = dict({0: 1, 1: 2, 2: 3});
    var i = iter(d);

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var t = tuple([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.PY$next() == 7 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 5 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var t = list([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.PY$next() == 7 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 5 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });

    var i = iter(range(5));

    test(function() { return i.PY$next() == 0 });
    test(function() { return i.PY$next() == 1 });
    test(function() { return i.PY$next() == 2 });
    test(function() { return i.PY$next() == 3 });
    test(function() { return i.PY$next() == 4 });

    raises(py_builtins.StopIteration, function() { i.PY$next() });
}

function test_tuple() {
    raises(py_builtins.TypeError, function() { tuple(1, 2, 3) });

    var t = tuple();

    test(function() { return str(t) == '()' });
    test(function() { return len(t) == 0 });

    test(function() { return t.PY$__contains__(5) == False });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(0) });

    raises(py_builtins.TypeError, function() { t.PY$__setitem__(7, 0) });
    raises(py_builtins.TypeError, function() { t.PY$__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.PY$index(5) });
    test(function() { return t.PY$count(5) == 0 });

    test(function() { return hash(t) == 3430008 });

    var t = tuple([1]);

    test(function() { return str(t) == '(1,)' });
    test(function() { return len(t) == 1 });

    var t = tuple([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str(t) == '(3, 4, 5, 5, 4, 4, 1)' });
    test(function() { return len(t) == 7 });

    test(function() { return t.PY$__contains__(5) == True });
    test(function() { return t.PY$__getitem__(int(0)) == 3 });
    test(function() { return t.PY$__getitem__(int(1)) == 4 });
    test(function() { return t.PY$__getitem__(int(2)) == 5 });
    test(function() { return t.PY$__getitem__(int(3)) == 5 });
    test(function() { return t.PY$__getitem__(int(4)) == 4 });
    test(function() { return t.PY$__getitem__(int(5)) == 4 });
    test(function() { return t.PY$__getitem__(int(6)) == 1 });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(7) });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(8) });
    test(function() { return t.PY$__getitem__(int(-1)) == 1; });
    test(function() { return t.PY$__getitem__(int(-2)) == 4; });
    test(function() { return t.PY$__getitem__(int(-3)) == 4; });
    test(function() { return t.PY$__getitem__(int(-4)) == 5; });
    test(function() { return t.PY$__getitem__(int(-5)) == 5; });
    test(function() { return t.PY$__getitem__(int(-6)) == 4; });
    test(function() { return t.PY$__getitem__(int(-7)) == 3; });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-8); });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(-9); });

    raises(py_builtins.TypeError, function() { t.PY$__setitem__(7, 0); });
    raises(py_builtins.TypeError, function() { t.PY$__delitem__(7); });

    test(function() { return t.PY$index(5) == 2 });
    test(function() { return t.PY$count(5) == 2 });

    test(function() { return hash(t) == -2017591611 });

    t = tuple([1, 2, 3, 4]);
    test(function() { return str(t) == '(1, 2, 3, 4)' })
    test(function() { return str(tuple(t)) == '(1, 2, 3, 4)' })
    test(function() { return str(list(t)) == '[1, 2, 3, 4]' })
    test(function() { return str(tuple(iter(t))) == '(1, 2, 3, 4)' })
    test(function() { return str(list(iter(t))) == '[1, 2, 3, 4]' })
    test(function() { return str(tuple(tuple(t))) == '(1, 2, 3, 4)' })
    test(function() { return str(list(tuple(t))) == '[1, 2, 3, 4]' })
    test(function() { return str(tuple(list(t))) == '(1, 2, 3, 4)' })
    test(function() { return str(list(list(t))) == '[1, 2, 3, 4]' })
    test(function() { return str(tuple(iter(tuple(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str(list(iter(tuple(t)))) == '[1, 2, 3, 4]' })
    test(function() { return str(tuple(iter(list(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str(list(iter(list(t)))) == '[1, 2, 3, 4]' })
}

function test_list() {
    raises(py_builtins.TypeError, function() { list(1, 2, 3) });

    var t = list();

    test(function() { return str(t) == '[]' });
    test(function() { return len(t) == 0 });

    test(function() { return t.PY$__contains__(5) == False });
    raises(py_builtins.IndexError, function() { t.PY$__getitem__(0) });

    raises(py_builtins.IndexError, function() { t.PY$__setitem__(7, 0) });
    raises(py_builtins.IndexError, function() { t.PY$__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.PY$index(5) });
    test(function() { return t.PY$count(5) == 0 });

    raises(py_builtins.AttributeError, function() { return hash(t) });

    var t = list([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str(t) == '[3, 4, 5, 5, 4, 4, 1]' });
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
    test(function() { return str(t) == '[3, 4, 5, 5, 4, 4, 1, 3]' });

    t.PY$__setitem__(1, 3);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1, 3]' });
    t.PY$__setitem__(7, 0);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1, 0]' });
    t.PY$__delitem__(7);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1]' });
    t.PY$__delitem__(1);
    test(function() { return str(t) == '[3, 5, 5, 4, 4, 1]' });
    t.PY$__delitem__(1);
    test(function() { return str(t) == '[3, 5, 4, 4, 1]' });
    t.PY$__delitem__(0);
    test(function() { return str(t) == '[5, 4, 4, 1]' });
    raises(py_builtins.IndexError, function() { t.PY$__delitem__(4) });

    t.PY$__setitem__(0, 1);
    test(function() { return str(t) == '[1, 4, 4, 1]' });
    t.PY$__setitem__(1, 2);
    test(function() { return str(t) == '[1, 2, 4, 1]' });
    t.PY$__setitem__(2, 3);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.PY$__setitem__(3, 4);
    test(function() { return str(t) == '[1, 2, 3, 4]' });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(4, 5) });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(5, 6) });
    t.PY$__setitem__(-1, 1);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.PY$__setitem__(-2, 2);
    test(function() { return str(t) == '[1, 2, 2, 1]' });
    t.PY$__setitem__(-3, 3);
    test(function() { return str(t) == '[1, 3, 2, 1]' });
    t.PY$__setitem__(-4, 4);
    test(function() { return str(t) == '[4, 3, 2, 1]' });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(-5, 5) });
    raises(py_builtins.IndexError, function() { t.PY$__setitem__(-6, 6) });


    t = list([1, 2, 3, 4]);
    test(function() { return str(t) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(t)) == '(1, 2, 3, 4)' });
    test(function() { return str(list(t)) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(iter(t))) == '(1, 2, 3, 4)' });
    test(function() { return str(list(iter(t))) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(tuple(t))) == '(1, 2, 3, 4)' });
    test(function() { return str(list(tuple(t))) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(list(t))) == '(1, 2, 3, 4)' });
    test(function() { return str(list(list(t))) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(iter(tuple(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str(list(iter(tuple(t)))) == '[1, 2, 3, 4]' });
    test(function() { return str(tuple(iter(list(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str(list(iter(list(t)))) == '[1, 2, 3, 4]' });

    t = list([]);
    test(function() { return str(t) == '[]' });
    t.PY$append(1);
    test(function() { return str(t) == '[1]' });
    t.PY$append(5);
    test(function() { return str(t) == '[1, 5]' });
    test(function() { return t.PY$pop() == 5 });
    test(function() { return str(t) == '[1]' });
    test(function() { return t.PY$pop() == 1 });
    test(function() { return str(t) == '[]' });
    raises(py_builtins.IndexError, function() { t.PY$pop() });

    t = list([4, 3, 1, 2]);
    test(function() { return str(t) == '[4, 3, 1, 2]' });
    t.PY$remove(3);
    test(function() { return str(t) == '[4, 1, 2]' });
    raises(py_builtins.ValueError, function() { t.PY$remove(3) });
    t.PY$remove(4);
    test(function() { return str(t) == '[1, 2]' });
    t.PY$remove(2);
    test(function() { return str(t) == '[1]' });
    t.PY$remove(1);
    test(function() { return str(t) == '[]' });
    raises(py_builtins.ValueError, function() { t.PY$remove(3) });

    var t1 = tuple([1, 2]);
    var t2 = tuple([1, 3]);
    t = list([t1, t2]);
    test(function() { return str(t) == '[(1, 2), (1, 3)]' });
    test(function() { return t.PY$index(t1) == 0 });
    test(function() { return t.PY$index(t2) == 1 });
    test(function() { return t.PY$index(tuple([1, 2])) == 0 });
    test(function() { return t.PY$index(tuple([1, 3])) == 1 });
}

function test_range() {
    // Test tuple/list conversion from range()
    var t = tuple(range(5));
    test(function() { return str(t) == '(0, 1, 2, 3, 4)' });
    var t = list(range(5));
    test(function() { return str(t) == '[0, 1, 2, 3, 4]' });

    // test min/max/step in range():
    t = list(range(1, 3));
    test(function() { return str(t) == '[1, 2]' });
    t = list(range(1, 5, 2));
    test(function() { return str(t) == '[1, 3]' });

    // test iter:
    var t = list(iter(range(5)));
    test(function() { return str(t) == '[0, 1, 2, 3, 4]' });
}

function test_map() {
    var f = function(x) { return x*x };
    var a = list([1, 2, 3]);

    test(function() { return str(map(f, list())) == '[]' });
    test(function() { return str(map(f, a)) == '[1, 4, 9]' });

    raises(py_builtins.TypeError, function() { map(f) });
    raises(py_builtins.NotImplementedError, function() { map(f, a, a) });
}

function test_zip() {
    test(function() { return str(zip()) == "[]" });

    var a = list([1, 2, 3]);
    var b = list([4, 5, 6]);
    var c = list([7, 8, 9]);

    test(function() { return str(zip(a)) == "[(1,), (2,), (3,)]" });
    test(function() { return str(zip(a,b)) == "[(1, 4), (2, 5), (3, 6)]" });
    test(function() { return str(zip(a,b,c)) == "[(1, 4, 7), (2, 5, 8), (3, 6, 9)]" });

    var d = list([7, 8, 9, 10]);
    var e = list([7, 8, 9, 10, 11]);

    test(function() { return str(zip(a,d)) == "[(1, 7), (2, 8), (3, 9)]" });
    test(function() { return str(zip(d,a)) == "[(7, 1), (8, 2), (9, 3)]" });

    test(function() { return str(zip(e,d)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });
    test(function() { return str(zip(d,e)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });

    test(function() { return str(zip(e,a,d)) == "[(7, 1, 7), (8, 2, 8), (9, 3, 9)]" });
    test(function() { return str(zip(e,d,a)) == "[(7, 7, 1), (8, 8, 2), (9, 9, 3)]" });
}

function test_isinstance() {
    test(function() {
        return isinstance(py_builtins.StopIteration(), py_builtins.StopIteration) == True;
    });

    test(function() {
        return isinstance(py_builtins.StopIteration(), py_builtins.ValueError) == False;
    });

    test(function() { return isinstance([], tuple()) == False });

    var t = tuple([1, 2, 3]);

    test(function() { return isinstance(t, Array) == False });
    test(function() { return isinstance(t, Number) == False });
    test(function() { return isinstance(t, String) == False });

    test(function() { return isinstance(t, tuple()) == False });

    test(function() { return isinstance(t, tuple([Number, Array])) == False });
    test(function() { return isinstance(t, tuple([Array, Number])) == False });

    test(function() { return isinstance(t, tuple([Number, String])) == False });

    test(function() { return isinstance(t, tuple) == True });
    test(function() { return isinstance(t, list) == False });
    test(function() { return isinstance(t, dict) == False });

    test(function() { return isinstance(t, tuple([list, dict])) == False });
}

function test_exceptions() {
    var e = py_builtins.NotImplementedError('not implemented');

    test(function() { return e.PY$__class__.PY$__name__ == 'NotImplementedError' });
    test(function() { return e.PY$message == 'not implemented' });

    var e = py_builtins.ZeroDivisionError('division by zero');

    test(function() { return e.PY$__class__.PY$__name__ == 'ZeroDivisionError' });
    test(function() { return e.PY$message == 'division by zero' });

    var e = py_builtins.AssertionError('assertion error');

    test(function() { return e.PY$__class__.PY$__name__ == 'AssertionError' });
    test(function() { return e.PY$message == 'assertion error' });

    var e = py_builtins.AttributeError('attribute error');

    test(function() { return e.PY$__class__.PY$__name__ == 'AttributeError' });
    test(function() { return e.PY$message == 'attribute error' });

    var e = py_builtins.RuntimeError('runtime error');

    test(function() { return e.PY$__class__.PY$__name__ == 'RuntimeError' });
    test(function() { return e.PY$message == 'runtime error' });

    var e = py_builtins.ImportError('import error');

    test(function() { return e.PY$__class__.PY$__name__ == 'ImportError' });
    test(function() { return e.PY$message == 'import error' });

    var e = py_builtins.TypeError('type error');

    test(function() { return e.PY$__class__.PY$__name__ == 'TypeError' });
    test(function() { return e.PY$message == 'type error' });

    var e = py_builtins.ValueError('value error');

    test(function() { return e.PY$__class__.PY$__name__ == 'ValueError' });
    test(function() { return e.PY$message == 'value error' });

    var e = py_builtins.NameError('name error');

    test(function() { return e.PY$__class__.PY$__name__ == 'NameError' });
    test(function() { return e.PY$message == 'name error' });

    var e = py_builtins.IndexError('index error');

    test(function() { return e.PY$__class__.PY$__name__ == 'IndexError' });
    test(function() { return e.PY$message == 'index error' });

    var e = py_builtins.KeyError('key error');

    test(function() { return e.PY$__class__.PY$__name__ == 'KeyError' });
    test(function() { return e.PY$message == 'key error' });

    var e = py_builtins.StopIteration('stop iteration');

    test(function() { return e.PY$__class__.PY$__name__ == 'StopIteration' });
    test(function() { return e.PY$message == 'stop iteration' });
}

function test_slice() {
    var s = slice(3);
    test(function() { return s.start == null });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple([0, 3, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple([0, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple([0, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple([0, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple([0, 0, 1])) });

    var t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8, 9, 10])) });
    t = tuple([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8, 9])) });
    t = tuple([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8, 9, 10])) });
    t = list([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8, 9])) });
    t = list([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8])) });

    s = slice(null);
    test(function() { return s.start == null });
    test(function() { return s.stop == null });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple([0, 10, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple([0, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple([0, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple([0, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple([0, 0, 1])) });

    var t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8, 9, 10, 11, 12])) });
    t = tuple([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8, 9])) });
    t = tuple([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([8])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8, 9, 10, 11, 12])) });
    t = list([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8, 9])) });
    t = list([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([8])) });

    s = slice(1, 3);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple([1, 3, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple([1, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple([1, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple([1, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple([0, 0, 1])) });

    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([9, 10])) });
    t = tuple([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([9])) });
    t = tuple([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([9, 10])) });
    t = list([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([9])) });
    t = list([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([])) });

    s = slice(1, 10, 2);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 10 });
    test(function() { return s.step == 2 });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple([1, 10, 2])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple([1, 3, 2])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple([1, 2, 2])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple([1, 1, 2])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple([0, 0, 2])) });

    t = tuple([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([9, 11, 13])) });
    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([9, 11])) });
    t = tuple([8, 9, 10]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([9])) });
    t = tuple([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([9, 11, 13])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([9, 11])) });
    t = list([8, 9, 10]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([9])) });
    t = list([8]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([])) });

    s = slice(4, 6, 1);
    test(function() { return s.start == 4 });
    test(function() { return s.stop == 6 });
    test(function() { return s.step == 1 });
    test(function() { return s.PY$indices(10).PY$__eq__(tuple([4, 6, 1])) });
    test(function() { return s.PY$indices(6).PY$__eq__(tuple([4, 6, 1])) });
    test(function() { return s.PY$indices(5).PY$__eq__(tuple([4, 5, 1])) });
    test(function() { return s.PY$indices(4).PY$__eq__(tuple([4, 4, 1])) });
    test(function() { return s.PY$indices(3).PY$__eq__(tuple([3, 3, 1])) });
    test(function() { return s.PY$indices(2).PY$__eq__(tuple([2, 2, 1])) });
    test(function() { return s.PY$indices(1).PY$__eq__(tuple([1, 1, 1])) });
    test(function() { return s.PY$indices(0).PY$__eq__(tuple([0, 0, 1])) });

    t = tuple([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([12, 13])) });
    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([12])) });
    t = tuple([8, 9, 10, 11]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([])) });
    t = tuple([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([12, 13])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([12])) });
    t = list([8, 9, 10, 11]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([])) });
    t = list([8, 9]);
    test(function() { return t.PY$__getitem__(s).PY$__eq__(list([])) });

    s = slice(0, -20);
    test(function() { return s.start == 0 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(50).PY$__eq__(tuple([0, 30, 1])) });
    test(function() { return s.PY$indices(40).PY$__eq__(tuple([0, 20, 1])) });
    test(function() { return s.PY$indices(21).PY$__eq__(tuple([0, 1, 1])) });
    test(function() { return s.PY$indices(20).PY$__eq__(tuple([0, 0, 1])) });

    s = slice(-3, -20);
    test(function() { return s.start == -3 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.PY$indices(50).PY$__eq__(tuple([47, 30, 1])) });
    test(function() { return s.PY$indices(40).PY$__eq__(tuple([37, 20, 1])) });
    test(function() { return s.PY$indices(21).PY$__eq__(tuple([18, 1, 1])) });
    test(function() { return s.PY$indices(20).PY$__eq__(tuple([17, 0, 1])) });
}

function test_to_js() {
    var t = js(tuple([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(list([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(dict({1: "s", 2: 3}));
    test(function() { return t[1] == "s" });
    test(function() { return t[2] == 3 });

    var t = js(tuple([1, "s", dict({1: "s", 2: 3})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });

    var t = js(tuple([1, "s", dict({1: "s", 2: 3, "x": tuple([8, 9])})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });
    test(function() { return t[2]["x"][0] == 8 });
    test(function() { return t[2]["x"][1] == 9 });
}

function test_str() {
    var s = str("some testing string");
    test(function() { return len(s) == 19 });
    test(function() { return s.PY$__getitem__(0) == "s" });
    test(function() { return s.PY$__getitem__(1) == "o" });
    test(function() { return s.PY$__getitem__(2) == "m" });
    test(function() { return s.PY$__getitem__(3) == "e" });
    test(function() { return s.PY$__getitem__(4) == " " });
    test(function() { return s.PY$__getitem__(5) == "t" });
    raises(py_builtins.TypeError, function() { s.PY$__setitem__(5, 3) });
    raises(py_builtins.TypeError, function() { s.PY$__delitem__(5) });

    test(function() { return s.PY$__getitem__(slice(3, 6)) == "e t" });
    test(function() { return s.PY$__getitem__(slice(1, 3)) == "om" });
    test(function() { return s.PY$__getitem__(slice(1, null)) == "ome testing string" });
    test(function() { return s.PY$__getitem__(slice(null, 3)) == "som" });
    test(function() { return s.PY$__getitem__(slice(3)) == "som" });
    test(function() { return s.PY$__getitem__(slice(1, 8, 2)) == "oets" });

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

    var t = tuple(["a", "b", "c"]);
    test(function() { return t.PY$__contains__("a") == True });
    test(function() { return t.PY$__contains__("b") == True });
    test(function() { return t.PY$__contains__("c") == True });
    test(function() { return t.PY$__contains__("d") == False });
    test(function() { return t.PY$__contains__(88) == False });

    var t = tuple([str("a"), str("b"), str("c")]);
    test(function() { return t.PY$__contains__("a") == True });
    test(function() { return t.PY$__contains__("b") == True });
    test(function() { return t.PY$__contains__("c") == True });
    test(function() { return t.PY$__contains__("d") == False });
    test(function() { return t.PY$__contains__(88) == False });
    test(function() { return t.PY$__contains__(str("a")) == True });
    test(function() { return t.PY$__contains__(str("b")) == True });
    test(function() { return t.PY$__contains__(str("c")) == True });
    test(function() { return t.PY$__contains__(str("d")) == False });
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
