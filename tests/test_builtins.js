/* TESTS for the py-builtins.js module */

function test(code) {
    if (!code()) {
        throw new py_builtins.AssertionError("test failed: " + code);
    }
}

function raises(exc, code) {
    try {
        code();
    } catch (e) {
        var name = e.__class__.__name__;

        if (name == exc.__name__) {
            return;
        } else {
            throw new py_builtins.AssertionError(name + " exception was thrown in " + code);
        }
    }

    throw new py_builtins.AssertionError("did not raise " + exc.__name__ + " in " + code);
}

function test_dict() {
    var d = dict.__call__();

    test(function() { return str.__call__(d) == '{}' });
    test(function() { return len(d) == 0 });

    raises(py_builtins.KeyError, function() { d.popitem() });

    raises(py_builtins.KeyError, function() { d.pop(0) });
    raises(py_builtins.KeyError, function() { d.__getitem__(0) });
    raises(py_builtins.KeyError, function() { d.__delitem__(0) });

    raises(py_builtins.KeyError, function() { d.pop('a') });
    raises(py_builtins.KeyError, function() { d.__getitem__('a') });
    raises(py_builtins.KeyError, function() { d.__delitem__('a') });

    d.__setitem__(0, 1);

    test(function() { return str.__call__(d) == '{0: 1}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.__getitem__(0) == 1 });

    d.__setitem__(0, 2);

    test(function() { return str.__call__(d) == '{0: 2}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.__getitem__(0) == 2 });

    test(function() { return d.pop(0) == 2 });
    test(function() { return len(d) == 0 });

    d = dict.__call__({1: 6, 2: 8});
    test(function() { return str.__call__(d) == '{1: 6, 2: 8}' });
    d = dict.__call__(tuple.__call__([tuple.__call__([1, 6]), tuple.__call__([2, 8])]));
    test(function() { return str.__call__(d) == '{1: 6, 2: 8}' });
    d = dict.__call__(tuple.__call__([tuple.__call__([1, "x"]), tuple.__call__([2, "y"])]));
    // This will change when repr() is implemented:
    test(function() { return str.__call__(d) == '{1: x, 2: y}' });

    d = dict.__call__(tuple.__call__([tuple.__call__([1, str.__call__("x")]), tuple.__call__([2, str.__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.__call__(d) == '{1: x, 2: y}' });

    d = dict.__call__(tuple.__call__([tuple.__call__(["a", str.__call__("x")]), tuple.__call__(["b", str.__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.__call__(d) == '{a: x, b: y}' });

    d = dict.__call__(tuple.__call__([tuple.__call__([str.__call__("a"), str.__call__("x")]), tuple.__call__([str.__call__("b"), str.__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.__call__(d) == '{a: x, b: y}' });

    d = dict.__call__(list.__call__([list.__call__([str.__call__("a"), str.__call__("x")]), list.__call__([str.__call__("b"), str.__call__("y")])]));
    // This will change when repr() is implemented:
    test(function() { return str.__call__(d) == '{a: x, b: y}' });
}

function test_iter() {
    var a = [0, 1, 2];
    var i = iter.__call__(a);

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });

    var d = dict.__call__({0: 1, 1: 2, 2: 3});
    var i = iter.__call__(d);

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });

    raises(py_builtins.StopIteration, function() { i.next() });

    var t = tuple.__call__([7, 3, 5]);
    var i = iter.__call__(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(py_builtins.StopIteration, function() { i.next() });

    var t = list.__call__([7, 3, 5]);
    var i = iter.__call__(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(py_builtins.StopIteration, function() { i.next() });

    var i = iter.__call__(range(5));

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 4 });

    raises(py_builtins.StopIteration, function() { i.next() });
}

function test_tuple() {
    raises(py_builtins.TypeError, function() { tuple.__call__(1, 2, 3) });

    var t = tuple.__call__();

    test(function() { return str.__call__(t) == '()' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(py_builtins.IndexError, function() { t.__getitem__(0) });

    raises(py_builtins.TypeError, function() { t.__setitem__(7, 0) });
    raises(py_builtins.TypeError, function() { t.__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.index(5) });
    test(function() { return t.count(5) == 0 });

    test(function() { return hash(t) == 3430008 });

    var t = tuple.__call__([1]);

    test(function() { return str.__call__(t) == '(1,)' });
    test(function() { return len(t) == 1 });

    var t = tuple.__call__([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str.__call__(t) == '(3, 4, 5, 5, 4, 4, 1)' });
    test(function() { return len(t) == 7 });

    test(function() { return t.__contains__(5) == true });
    test(function() { return t.__getitem__(0) == 3 });
    test(function() { return t.__getitem__(1) == 4 });
    test(function() { return t.__getitem__(2) == 5 });
    test(function() { return t.__getitem__(3) == 5 });
    test(function() { return t.__getitem__(4) == 4 });
    test(function() { return t.__getitem__(5) == 4 });
    test(function() { return t.__getitem__(6) == 1 });
    raises(py_builtins.IndexError, function() { t.__getitem__(7) });
    raises(py_builtins.IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1; });
    test(function() { return t.__getitem__(-2) == 4; });
    test(function() { return t.__getitem__(-3) == 4; });
    test(function() { return t.__getitem__(-4) == 5; });
    test(function() { return t.__getitem__(-5) == 5; });
    test(function() { return t.__getitem__(-6) == 4; });
    test(function() { return t.__getitem__(-7) == 3; });
    raises(py_builtins.IndexError, function() { t.__getitem__(-8); });
    raises(py_builtins.IndexError, function() { t.__getitem__(-9); });

    raises(py_builtins.TypeError, function() { t.__setitem__(7, 0); });
    raises(py_builtins.TypeError, function() { t.__delitem__(7); });

    test(function() { return t.index(5) == 2 });
    test(function() { return t.count(5) == 2 });

    test(function() { return hash(t) == -2017591611 });

    t = tuple.__call__([1, 2, 3, 4]);
    test(function() { return str.__call__(t) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(tuple.__call__(t)) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(t)) == '[1, 2, 3, 4]' })
    test(function() { return str.__call__(tuple.__call__(iter.__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(iter.__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.__call__(tuple.__call__(tuple.__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(tuple.__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.__call__(tuple.__call__(list.__call__(t))) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(list.__call__(t))) == '[1, 2, 3, 4]' })
    test(function() { return str.__call__(tuple.__call__(iter.__call__(tuple.__call__(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(iter.__call__(tuple.__call__(t)))) == '[1, 2, 3, 4]' })
    test(function() { return str.__call__(tuple.__call__(iter.__call__(list.__call__(t)))) == '(1, 2, 3, 4)' })
    test(function() { return str.__call__(list.__call__(iter.__call__(list.__call__(t)))) == '[1, 2, 3, 4]' })
}

function test_list() {
    raises(py_builtins.TypeError, function() { list.__call__(1, 2, 3) });

    var t = list.__call__();

    test(function() { return str.__call__(t) == '[]' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(py_builtins.IndexError, function() { t.__getitem__(0) });

    raises(py_builtins.IndexError, function() { t.__setitem__(7, 0) });
    raises(py_builtins.IndexError, function() { t.__delitem__(7) });

    raises(py_builtins.ValueError, function() { t.index(5) });
    test(function() { return t.count(5) == 0 });

    raises(py_builtins.AttributeError, function() { return hash(t) });

    var t = list.__call__([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str.__call__(t) == '[3, 4, 5, 5, 4, 4, 1]' });
    test(function() { return len(t) == 7 });

    test(function() { return t.__contains__(5) == true });
    test(function() { return t.__getitem__(0) == 3 });
    test(function() { return t.__getitem__(1) == 4 });
    test(function() { return t.__getitem__(2) == 5 });
    test(function() { return t.__getitem__(3) == 5 });
    test(function() { return t.__getitem__(4) == 4 });
    test(function() { return t.__getitem__(5) == 4 });
    test(function() { return t.__getitem__(6) == 1 });
    raises(py_builtins.IndexError, function() { t.__getitem__(7) });
    raises(py_builtins.IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1 });
    test(function() { return t.__getitem__(-2) == 4 });
    test(function() { return t.__getitem__(-3) == 4 });
    test(function() { return t.__getitem__(-4) == 5 });
    test(function() { return t.__getitem__(-5) == 5 });
    test(function() { return t.__getitem__(-6) == 4 });
    test(function() { return t.__getitem__(-7) == 3 });
    raises(py_builtins.IndexError, function() { t.__getitem__(-8) });
    raises(py_builtins.IndexError, function() { t.__getitem__(-9) });

    raises(py_builtins.IndexError, function() { t.__setitem__(7, 0) });
    raises(py_builtins.IndexError, function() { t.__delitem__(7) });

    test(function() { return t.index(5) == 2 });
    test(function() { return t.count(5) == 2 });

    raises(py_builtins.AttributeError, function() { return hash(t) });

    t.append(3);
    test(function() { return str.__call__(t) == '[3, 4, 5, 5, 4, 4, 1, 3]' });

    t.__setitem__(1, 3);
    test(function() { return str.__call__(t) == '[3, 3, 5, 5, 4, 4, 1, 3]' });
    t.__setitem__(7, 0);
    test(function() { return str.__call__(t) == '[3, 3, 5, 5, 4, 4, 1, 0]' });
    t.__delitem__(7);
    test(function() { return str.__call__(t) == '[3, 3, 5, 5, 4, 4, 1]' });
    t.__delitem__(1);
    test(function() { return str.__call__(t) == '[3, 5, 5, 4, 4, 1]' });
    t.__delitem__(1);
    test(function() { return str.__call__(t) == '[3, 5, 4, 4, 1]' });
    t.__delitem__(0);
    test(function() { return str.__call__(t) == '[5, 4, 4, 1]' });
    raises(py_builtins.IndexError, function() { t.__delitem__(4) });

    t.__setitem__(0, 1);
    test(function() { return str.__call__(t) == '[1, 4, 4, 1]' });
    t.__setitem__(1, 2);
    test(function() { return str.__call__(t) == '[1, 2, 4, 1]' });
    t.__setitem__(2, 3);
    test(function() { return str.__call__(t) == '[1, 2, 3, 1]' });
    t.__setitem__(3, 4);
    test(function() { return str.__call__(t) == '[1, 2, 3, 4]' });
    raises(py_builtins.IndexError, function() { t.__setitem__(4, 5) });
    raises(py_builtins.IndexError, function() { t.__setitem__(5, 6) });
    t.__setitem__(-1, 1);
    test(function() { return str.__call__(t) == '[1, 2, 3, 1]' });
    t.__setitem__(-2, 2);
    test(function() { return str.__call__(t) == '[1, 2, 2, 1]' });
    t.__setitem__(-3, 3);
    test(function() { return str.__call__(t) == '[1, 3, 2, 1]' });
    t.__setitem__(-4, 4);
    test(function() { return str.__call__(t) == '[4, 3, 2, 1]' });
    raises(py_builtins.IndexError, function() { t.__setitem__(-5, 5) });
    raises(py_builtins.IndexError, function() { t.__setitem__(-6, 6) });


    t = list.__call__([1, 2, 3, 4]);
    test(function() { return str.__call__(t) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(t)) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(t)) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(iter.__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(iter.__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(tuple.__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(tuple.__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(list.__call__(t))) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(list.__call__(t))) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(iter.__call__(tuple.__call__(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(iter.__call__(tuple.__call__(t)))) == '[1, 2, 3, 4]' });
    test(function() { return str.__call__(tuple.__call__(iter.__call__(list.__call__(t)))) == '(1, 2, 3, 4)' });
    test(function() { return str.__call__(list.__call__(iter.__call__(list.__call__(t)))) == '[1, 2, 3, 4]' });

    t = list.__call__([]);
    test(function() { return str.__call__(t) == '[]' });
    t.append(1);
    test(function() { return str.__call__(t) == '[1]' });
    t.append(5);
    test(function() { return str.__call__(t) == '[1, 5]' });
    test(function() { return t.pop() == 5 });
    test(function() { return str.__call__(t) == '[1]' });
    test(function() { return t.pop() == 1 });
    test(function() { return str.__call__(t) == '[]' });
    raises(py_builtins.IndexError, function() { t.pop() });

    t = list.__call__([4, 3, 1, 2]);
    test(function() { return str.__call__(t) == '[4, 3, 1, 2]' });
    t.remove(3);
    test(function() { return str.__call__(t) == '[4, 1, 2]' });
    raises(py_builtins.ValueError, function() { t.remove(3) });
    t.remove(4);
    test(function() { return str.__call__(t) == '[1, 2]' });
    t.remove(2);
    test(function() { return str.__call__(t) == '[1]' });
    t.remove(1);
    test(function() { return str.__call__(t) == '[]' });
    raises(py_builtins.ValueError, function() { t.remove(3) });

    var t1 = tuple.__call__([1, 2]);
    var t2 = tuple.__call__([1, 3]);
    t = list.__call__([t1, t2]);
    test(function() { return str.__call__(t) == '[(1, 2), (1, 3)]' });
    test(function() { return t.index(t1) == 0 });
    test(function() { return t.index(t2) == 1 });
    test(function() { return t.index(tuple.__call__([1, 2])) == 0 });
    test(function() { return t.index(tuple.__call__([1, 3])) == 1 });
}

function test_range() {
    // Test tuple/list conversion from range()
    var t = tuple.__call__(range(5));
    test(function() { return str.__call__(t) == '(0, 1, 2, 3, 4)' });
    var t = list.__call__(range(5));
    test(function() { return str.__call__(t) == '[0, 1, 2, 3, 4]' });

    // test min/max/step in range():
    t = list.__call__(range(1, 3));
    test(function() { return str.__call__(t) == '[1, 2]' });
    t = list.__call__(range(1, 5, 2));
    test(function() { return str.__call__(t) == '[1, 3]' });

    // test iter:
    var t = list.__call__(iter.__call__(range(5)));
    test(function() { return str.__call__(t) == '[0, 1, 2, 3, 4]' });
}

function test_map() {
    var f = function(x) { return x*x };
    var a = list.__call__([1, 2, 3]);

    test(function() { return str.__call__(map(f, list.__call__())) == '[]' });
    test(function() { return str.__call__(map(f, a)) == '[1, 4, 9]' });

    raises(py_builtins.TypeError, function() { map(f) });
    raises(py_builtins.NotImplementedError, function() { map(f, a, a) });
}

function test_zip() {
    test(function() { return str.__call__(zip()) == "[]" });

    var a = list.__call__([1, 2, 3]);
    var b = list.__call__([4, 5, 6]);
    var c = list.__call__([7, 8, 9]);

    test(function() { return str.__call__(zip(a)) == "[(1,), (2,), (3,)]" });
    test(function() { return str.__call__(zip(a,b)) == "[(1, 4), (2, 5), (3, 6)]" });
    test(function() { return str.__call__(zip(a,b,c)) == "[(1, 4, 7), (2, 5, 8), (3, 6, 9)]" });

    var d = list.__call__([7, 8, 9, 10]);
    var e = list.__call__([7, 8, 9, 10, 11]);

    test(function() { return str.__call__(zip(a,d)) == "[(1, 7), (2, 8), (3, 9)]" });
    test(function() { return str.__call__(zip(d,a)) == "[(7, 1), (8, 2), (9, 3)]" });

    test(function() { return str.__call__(zip(e,d)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });
    test(function() { return str.__call__(zip(d,e)) == "[(7, 7), (8, 8), (9, 9), (10, 10)]" });

    test(function() { return str.__call__(zip(e,a,d)) == "[(7, 1, 7), (8, 2, 8), (9, 3, 9)]" });
    test(function() { return str.__call__(zip(e,d,a)) == "[(7, 7, 1), (8, 8, 2), (9, 9, 3)]" });
}

function test_isinstance() {
    test(function() {
        return isinstance(new py_builtins.StopIteration(), py_builtins.StopIteration) == true;
    });

    test(function() {
        return isinstance(new py_builtins.StopIteration(), py_builtins.ValueError) == false;
    });

    test(function() { return isinstance([], Array) == true });
    test(function() { return isinstance([], Number) == false });
    test(function() { return isinstance([], String) == false });

    test(function() { return isinstance([], tuple.__call__()) == false });

    test(function() { return isinstance([], tuple.__call__([Number, Array])) == true });
    test(function() { return isinstance([], tuple.__call__([Array, Number])) == true });

    test(function() { return isinstance([], tuple.__call__([Number, String])) == false });

    var t = tuple.__call__([1, 2, 3]);

    test(function() { return isinstance(t, Array) == false });
    test(function() { return isinstance(t, Number) == false });
    test(function() { return isinstance(t, String) == false });

    test(function() { return isinstance(t, tuple.__call__()) == false });

    test(function() { return isinstance(t, tuple.__call__([Number, Array])) == false });
    test(function() { return isinstance(t, tuple.__call__([Array, Number])) == false });

    test(function() { return isinstance(t, tuple.__call__([Number, String])) == false });

    test(function() { return isinstance(t, tuple) == true });
    test(function() { return isinstance(t, list) == false });
    test(function() { return isinstance(t, dict) == false });

    test(function() { return isinstance(t, tuple.__call__([Number, tuple])) == true });
    test(function() { return isinstance(t, tuple.__call__([tuple, Number])) == true });

    test(function() { return isinstance(t, tuple.__call__([list, dict])) == false });
}

function test_exceptions() {
    var e = new py_builtins.NotImplementedError('not implemented');

    test(function() { return e.__class__.__name__ == 'NotImplementedError' });
    test(function() { return e.message == 'not implemented' });

    var e = new py_builtins.ZeroDivisionError('division by zero');

    test(function() { return e.__class__.__name__ == 'ZeroDivisionError' });
    test(function() { return e.message == 'division by zero' });

    var e = new py_builtins.AssertionError('assertion error');

    test(function() { return e.__class__.__name__ == 'AssertionError' });
    test(function() { return e.message == 'assertion error' });

    var e = new py_builtins.AttributeError('attribute error');

    test(function() { return e.__class__.__name__ == 'AttributeError' });
    test(function() { return e.message == 'attribute error' });

    var e = new py_builtins.RuntimeError('runtime error');

    test(function() { return e.__class__.__name__ == 'RuntimeError' });
    test(function() { return e.message == 'runtime error' });

    var e = new py_builtins.ImportError('import error');

    test(function() { return e.__class__.__name__ == 'ImportError' });
    test(function() { return e.message == 'import error' });

    var e = new py_builtins.TypeError('type error');

    test(function() { return e.__class__.__name__ == 'TypeError' });
    test(function() { return e.message == 'type error' });

    var e = new py_builtins.ValueError('value error');

    test(function() { return e.__class__.__name__ == 'ValueError' });
    test(function() { return e.message == 'value error' });

    var e = new py_builtins.NameError('name error');

    test(function() { return e.__class__.__name__ == 'NameError' });
    test(function() { return e.message == 'name error' });

    var e = new py_builtins.IndexError('index error');

    test(function() { return e.__class__.__name__ == 'IndexError' });
    test(function() { return e.message == 'index error' });

    var e = new py_builtins.KeyError('key error');

    test(function() { return e.__class__.__name__ == 'KeyError' });
    test(function() { return e.message == 'key error' });

    var e = new py_builtins.StopIteration('stop iteration');

    test(function() { return e.__class__.__name__ == 'StopIteration' });
    test(function() { return e.message == 'stop iteration' });
}

function test_slice() {
    var s = slice.__call__(3);
    test(function() { return s.start == null });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple.__call__([0, 3, 1])) });
    test(function() { return s.indices(3).__eq__(tuple.__call__([0, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple.__call__([0, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple.__call__([0, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple.__call__([0, 0, 1])) });

    var t = tuple.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8, 9, 10])) });
    t = tuple.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8, 9])) });
    t = tuple.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8])) });
    t = list.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8, 9, 10])) });
    t = list.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8, 9])) });
    t = list.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8])) });

    s = slice.__call__(null);
    test(function() { return s.start == null });
    test(function() { return s.stop == null });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple.__call__([0, 10, 1])) });
    test(function() { return s.indices(3).__eq__(tuple.__call__([0, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple.__call__([0, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple.__call__([0, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple.__call__([0, 0, 1])) });

    var t = tuple.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8, 9, 10, 11, 12])) });
    t = tuple.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8, 9])) });
    t = tuple.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([8])) });
    t = list.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8, 9, 10, 11, 12])) });
    t = list.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8, 9])) });
    t = list.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([8])) });

    s = slice.__call__(1, 3);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple.__call__([1, 3, 1])) });
    test(function() { return s.indices(3).__eq__(tuple.__call__([1, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple.__call__([1, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple.__call__([1, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple.__call__([0, 0, 1])) });

    t = tuple.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([9, 10])) });
    t = tuple.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([9])) });
    t = tuple.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([])) });
    t = list.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([9, 10])) });
    t = list.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([9])) });
    t = list.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([])) });

    s = slice.__call__(1, 10, 2);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 10 });
    test(function() { return s.step == 2 });
    test(function() { return s.indices(10).__eq__(tuple.__call__([1, 10, 2])) });
    test(function() { return s.indices(3).__eq__(tuple.__call__([1, 3, 2])) });
    test(function() { return s.indices(2).__eq__(tuple.__call__([1, 2, 2])) });
    test(function() { return s.indices(1).__eq__(tuple.__call__([1, 1, 2])) });
    test(function() { return s.indices(0).__eq__(tuple.__call__([0, 0, 2])) });

    t = tuple.__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([9, 11, 13])) });
    t = tuple.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([9, 11])) });
    t = tuple.__call__([8, 9, 10]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([9])) });
    t = tuple.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([])) });
    t = list.__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([9, 11, 13])) });
    t = list.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([9, 11])) });
    t = list.__call__([8, 9, 10]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([9])) });
    t = list.__call__([8]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([])) });

    s = slice.__call__(4, 6, 1);
    test(function() { return s.start == 4 });
    test(function() { return s.stop == 6 });
    test(function() { return s.step == 1 });
    test(function() { return s.indices(10).__eq__(tuple.__call__([4, 6, 1])) });
    test(function() { return s.indices(6).__eq__(tuple.__call__([4, 6, 1])) });
    test(function() { return s.indices(5).__eq__(tuple.__call__([4, 5, 1])) });
    test(function() { return s.indices(4).__eq__(tuple.__call__([4, 4, 1])) });
    test(function() { return s.indices(3).__eq__(tuple.__call__([3, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple.__call__([2, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple.__call__([1, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple.__call__([0, 0, 1])) });

    t = tuple.__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([12, 13])) });
    t = tuple.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([12])) });
    t = tuple.__call__([8, 9, 10, 11]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([])) });
    t = tuple.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple.__call__([])) });
    t = list.__call__([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([12, 13])) });
    t = list.__call__([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([12])) });
    t = list.__call__([8, 9, 10, 11]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([])) });
    t = list.__call__([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list.__call__([])) });

    s = slice.__call__(0, -20);
    test(function() { return s.start == 0 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.indices(50).__eq__(tuple.__call__([0, 30, 1])) });
    test(function() { return s.indices(40).__eq__(tuple.__call__([0, 20, 1])) });
    test(function() { return s.indices(21).__eq__(tuple.__call__([0, 1, 1])) });
    test(function() { return s.indices(20).__eq__(tuple.__call__([0, 0, 1])) });

    s = slice.__call__(-3, -20);
    test(function() { return s.start == -3 });
    test(function() { return s.stop == -20 });
    test(function() { return s.step == null });
    test(function() { return s.indices(50).__eq__(tuple.__call__([47, 30, 1])) });
    test(function() { return s.indices(40).__eq__(tuple.__call__([37, 20, 1])) });
    test(function() { return s.indices(21).__eq__(tuple.__call__([18, 1, 1])) });
    test(function() { return s.indices(20).__eq__(tuple.__call__([17, 0, 1])) });
}

function test_to_js() {
    var t = js(tuple.__call__([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(list.__call__([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = js(dict.__call__({1: "s", 2: 3}));
    test(function() { return t[1] == "s" });
    test(function() { return t[2] == 3 });

    var t = js(tuple.__call__([1, "s", dict.__call__({1: "s", 2: 3})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });

    var t = js(tuple.__call__([1, "s", dict.__call__({1: "s", 2: 3, "x": tuple.__call__([8, 9])})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });
    test(function() { return t[2]["x"][0] == 8 });
    test(function() { return t[2]["x"][1] == 9 });
}

function test_str() {
    var s = str.__call__("some testing string");
    test(function() { return len(s) == 19 });
    test(function() { return s.__getitem__(0) == "s" });
    test(function() { return s.__getitem__(1) == "o" });
    test(function() { return s.__getitem__(2) == "m" });
    test(function() { return s.__getitem__(3) == "e" });
    test(function() { return s.__getitem__(4) == " " });
    test(function() { return s.__getitem__(5) == "t" });
    raises(py_builtins.TypeError, function() { s.__setitem__(5, 3) });
    raises(py_builtins.TypeError, function() { s.__delitem__(5) });

    test(function() { return s.__getitem__(slice.__call__(3, 6)) == "e t" });
    test(function() { return s.__getitem__(slice.__call__(1, 3)) == "om" });
    test(function() { return s.__getitem__(slice.__call__(1, null)) == "ome testing string" });
    test(function() { return s.__getitem__(slice.__call__(null, 3)) == "som" });
    test(function() { return s.__getitem__(slice.__call__(3)) == "som" });
    test(function() { return s.__getitem__(slice.__call__(1, 8, 2)) == "oets" });

    test(function() { return s.count("t") == 3 });
    test(function() { return s.count("e") == 2 });
    test(function() { return s.count("m") == 1 });
    test(function() { return s.count("3") == 0 });

    test(function() { return s.index("t") == 5 });
    test(function() { return s.index("e") == 3 });
    test(function() { return s.index("m") == 2 });
    raises(py_builtins.ValueError, function() { s.index("3") });

    test(function() { return s.find("t") == 5 });
    test(function() { return s.find("e") == 3 });
    test(function() { return s.find("m") == 2 });
    test(function() { return s.find("3") == -1 });

    test(function() { return s.find("test") == 5 });
    test(function() { return s.find("testi") == 5 });
    test(function() { return s.find("testix") == -1 });

    var t = tuple.__call__(["a", "b", "c"]);
    test(function() { return t.__contains__("a") == true });
    test(function() { return t.__contains__("b") == true });
    test(function() { return t.__contains__("c") == true });
    test(function() { return t.__contains__("d") == false });
    test(function() { return t.__contains__(88) == false });

    var t = tuple.__call__([str.__call__("a"), str.__call__("b"), str.__call__("c")]);
    test(function() { return t.__contains__("a") == true });
    test(function() { return t.__contains__("b") == true });
    test(function() { return t.__contains__("c") == true });
    test(function() { return t.__contains__("d") == false });
    test(function() { return t.__contains__(88) == false });
    test(function() { return t.__contains__(str.__call__("a")) == true });
    test(function() { return t.__contains__(str.__call__("b")) == true });
    test(function() { return t.__contains__(str.__call__("c")) == true });
    test(function() { return t.__contains__(str.__call__("d")) == false });
}

function test_func() {
    var foo = $def(function(a) {
            return a+1;
            });
    test(function() { return foo(3) == 4 });
    test(function() { return foo(4) == 5 });

    foo = $def(function(a, b) {
            return a-b;
            });
    test(function() { return foo(3, 1) == 2 });
    test(function() { return foo(4, 1) == 3 });

    foo = $def({'b': 1}, function(a, b) {
            return a-b;
            });
    test(function() { return foo(3, -1) == 4 });
    test(function() { return foo(4, -1) == 5 });
    test(function() { return foo(3) == 2 });
    test(function() { return foo(4) == 3 });

    foo = $def({'a': 3, 'b': 1}, function(a, b) {
            return a-b;
            });
    test(function() { return foo(3, -1) == 4 });
    test(function() { return foo(4, -1) == 5 });
    test(function() { return foo(3) == 2 });
    test(function() { return foo(4) == 3 });
    test(function() { return foo() == 2 });

    foo = $def({'a': 3, 'b': 1}, true, true, function(a, b, args, kwargs) {
            return a-b;
            });
    test(function() { return foo(3, -1) == 4 });
    test(function() { return foo(4, -1) == 5 });
    test(function() { return foo(3) == 2 });
    test(function() { return foo(4) == 3 });
    test(function() { return foo() == 2 });
    test(function() { return foo(3, -1, 5) == 4 });
    test(function() { return foo(4, -1, 6, 7) == 5 });
    test(function() { return foo.args([4, -1], {'x': 40}) == 5 });
}

function tests() {
    try {
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
        print("Testing functions");
        test_func();
    } catch(e) {
        if (defined(e.__class__)) {
            if (defined(e.message)) {
                print(e.__class__.__name__ + ": " + e.message);
            } else {
                print(e.__class__.__name__ + ": ");
            }
        } else
            print(e)

        throw "Tests failed"
    }
}

tests();
