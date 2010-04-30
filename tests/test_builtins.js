/* TESTS for the py-builtins.js module */

function test(code) {
    if (!code()) {
        throw new py.AssertionError("test failed: " + code);
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
            throw new py.AssertionError(name + " exception was thrown in " + code);
        }
    }

    throw new py.AssertionError("did not raise " + exc.__name__ + " in " + code);
}

function test_dict() {
    var d = dict();

    test(function() { return str(d) == '{}' });
    test(function() { return len(d) == 0 });

    raises(py.KeyError, function() { d.popitem() });

    raises(py.KeyError, function() { d.pop(0) });
    raises(py.KeyError, function() { d.__getitem__(0) });
    raises(py.KeyError, function() { d.__delitem__(0) });

    raises(py.KeyError, function() { d.pop('a') });
    raises(py.KeyError, function() { d.__getitem__('a') });
    raises(py.KeyError, function() { d.__delitem__('a') });

    d.__setitem__(0, 1);

    test(function() { return str(d) == '{0: 1}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.__getitem__(0) == 1 });

    d.__setitem__(0, 2);

    test(function() { return str(d) == '{0: 2}' });
    test(function() { return len(d) == 1 });
    test(function() { return d.__getitem__(0) == 2 });

    test(function() { return d.pop(0) == 2 });
    test(function() { return len(d) == 0 });
}

function test_iter() {
    var a = [0, 1, 2];
    var i = iter(a);

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });

    var d = dict({0: 1, 1: 2, 2: 3});
    var i = iter(d);

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });

    raises(py.StopIteration, function() { i.next() });

    var t = tuple([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(py.StopIteration, function() { i.next() });

    var t = list([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(py.StopIteration, function() { i.next() });

    var i = iter(range(5));

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 4 });

    raises(py.StopIteration, function() { i.next() });
}

function test_tuple() {
    raises(py.TypeError, function() { tuple(1, 2, 3) });

    var t = tuple();

    test(function() { return str(t) == '()' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(py.IndexError, function() { t.__getitem__(0) });

    raises(py.TypeError, function() { t.__setitem__(7, 0) });
    raises(py.TypeError, function() { t.__delitem__(7) });

    raises(py.ValueError, function() { t.index(5) });
    test(function() { return t.count(5) == 0 });

    test(function() { return hash(t) == 3430008 });

    var t = tuple([1]);

    test(function() { return str(t) == '(1,)' });
    test(function() { return len(t) == 1 });

    var t = tuple([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str(t) == '(3, 4, 5, 5, 4, 4, 1)' });
    test(function() { return len(t) == 7 });

    test(function() { return t.__contains__(5) == true });
    test(function() { return t.__getitem__(0) == 3 });
    test(function() { return t.__getitem__(1) == 4 });
    test(function() { return t.__getitem__(2) == 5 });
    test(function() { return t.__getitem__(3) == 5 });
    test(function() { return t.__getitem__(4) == 4 });
    test(function() { return t.__getitem__(5) == 4 });
    test(function() { return t.__getitem__(6) == 1 });
    raises(py.IndexError, function() { t.__getitem__(7) });
    raises(py.IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1 });
    test(function() { return t.__getitem__(-2) == 4 });
    test(function() { return t.__getitem__(-3) == 4 });
    test(function() { return t.__getitem__(-4) == 5 });
    test(function() { return t.__getitem__(-5) == 5 });
    test(function() { return t.__getitem__(-6) == 4 });
    test(function() { return t.__getitem__(-7) == 3 });
    raises(py.IndexError, function() { t.__getitem__(-8) });
    raises(py.IndexError, function() { t.__getitem__(-9) });

    raises(py.TypeError, function() { t.__setitem__(7, 0) });
    raises(py.TypeError, function() { t.__delitem__(7) });

    test(function() { return t.index(5) == 2 });
    test(function() { return t.count(5) == 2 });

    test(function() { return hash(t) == -2017591611 });

    t = tuple([1, 2, 3, 4])
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
    raises(py.TypeError, function() { list(1, 2, 3) });

    var t = list();

    test(function() { return str(t) == '[]' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(py.IndexError, function() { t.__getitem__(0) });

    raises(py.IndexError, function() { t.__setitem__(7, 0) });
    raises(py.IndexError, function() { t.__delitem__(7) });

    raises(py.ValueError, function() { t.index(5) });
    test(function() { return t.count(5) == 0 });

    raises(py.AttributeError, function() { return hash(t) });

    var t = list([3, 4, 5, 5, 4, 4, 1]);

    test(function() { return str(t) == '[3, 4, 5, 5, 4, 4, 1]' });
    test(function() { return len(t) == 7 });

    test(function() { return t.__contains__(5) == true });
    test(function() { return t.__getitem__(0) == 3 });
    test(function() { return t.__getitem__(1) == 4 });
    test(function() { return t.__getitem__(2) == 5 });
    test(function() { return t.__getitem__(3) == 5 });
    test(function() { return t.__getitem__(4) == 4 });
    test(function() { return t.__getitem__(5) == 4 });
    test(function() { return t.__getitem__(6) == 1 });
    raises(py.IndexError, function() { t.__getitem__(7) });
    raises(py.IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1 });
    test(function() { return t.__getitem__(-2) == 4 });
    test(function() { return t.__getitem__(-3) == 4 });
    test(function() { return t.__getitem__(-4) == 5 });
    test(function() { return t.__getitem__(-5) == 5 });
    test(function() { return t.__getitem__(-6) == 4 });
    test(function() { return t.__getitem__(-7) == 3 });
    raises(py.IndexError, function() { t.__getitem__(-8) });
    raises(py.IndexError, function() { t.__getitem__(-9) });

    raises(py.IndexError, function() { t.__setitem__(7, 0) });
    raises(py.IndexError, function() { t.__delitem__(7) });

    test(function() { return t.index(5) == 2 });
    test(function() { return t.count(5) == 2 });

    raises(py.AttributeError, function() { return hash(t) });

    t.append(3);
    test(function() { return str(t) == '[3, 4, 5, 5, 4, 4, 1, 3]' });

    t.__setitem__(1, 3);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1, 3]' });
    t.__setitem__(7, 0);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1, 0]' });
    t.__delitem__(7);
    test(function() { return str(t) == '[3, 3, 5, 5, 4, 4, 1]' });
    t.__delitem__(1);
    test(function() { return str(t) == '[3, 5, 5, 4, 4, 1]' });
    t.__delitem__(1);
    test(function() { return str(t) == '[3, 5, 4, 4, 1]' });
    t.__delitem__(0);
    test(function() { return str(t) == '[5, 4, 4, 1]' });
    raises(py.IndexError, function() { t.__delitem__(4) });

    t.__setitem__(0, 1);
    test(function() { return str(t) == '[1, 4, 4, 1]' });
    t.__setitem__(1, 2);
    test(function() { return str(t) == '[1, 2, 4, 1]' });
    t.__setitem__(2, 3);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.__setitem__(3, 4);
    test(function() { return str(t) == '[1, 2, 3, 4]' });
    raises(py.IndexError, function() { t.__setitem__(4, 5) });
    raises(py.IndexError, function() { t.__setitem__(5, 6) });
    t.__setitem__(-1, 1);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.__setitem__(-2, 2);
    test(function() { return str(t) == '[1, 2, 2, 1]' });
    t.__setitem__(-3, 3);
    test(function() { return str(t) == '[1, 3, 2, 1]' });
    t.__setitem__(-4, 4);
    test(function() { return str(t) == '[4, 3, 2, 1]' });
    raises(py.IndexError, function() { t.__setitem__(-5, 5) });
    raises(py.IndexError, function() { t.__setitem__(-6, 6) });


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
    t.append(1);
    test(function() { return str(t) == '[1]' });
    t.append(5);
    test(function() { return str(t) == '[1, 5]' });
    test(function() { return t.pop() == 5 });
    test(function() { return str(t) == '[1]' });
    test(function() { return t.pop() == 1 });
    test(function() { return str(t) == '[]' });
    raises(py.IndexError, function() { t.pop() });

    t = list([4, 3, 1, 2]);
    test(function() { return str(t) == '[4, 3, 1, 2]' });
    t.remove(3);
    test(function() { return str(t) == '[4, 1, 2]' });
    raises(py.ValueError, function() { t.remove(3) });
    t.remove(4);
    test(function() { return str(t) == '[1, 2]' });
    t.remove(2);
    test(function() { return str(t) == '[1]' });
    t.remove(1);
    test(function() { return str(t) == '[]' });
    raises(py.ValueError, function() { t.remove(3) });

    var t1 = tuple([1, 2]);
    var t2 = tuple([1, 3]);
    t = list([t1, t2]);
    test(function() { return str(t) == '[(1, 2), (1, 3)]' });
    test(function() { return t.index(t1) == 0 });
    test(function() { return t.index(t2) == 1 });
    test(function() { return t.index(tuple([1, 2])) == 0 });
    test(function() { return t.index(tuple([1, 3])) == 1 });
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

    raises(py.TypeError, function() { map(f) });
    raises(py.NotImplementedError, function() { map(f, a, a) });
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
        return isinstance(new py.StopIteration(), py.StopIteration) == true;
    });

    test(function() {
        return isinstance(new py.StopIteration(), py.ValueError) == false;
    });

    test(function() { return isinstance([], Array) == true });
    test(function() { return isinstance([], Number) == false });
    test(function() { return isinstance([], String) == false });

    test(function() { return isinstance([], tuple()) == false });

    test(function() { return isinstance([], tuple([Number, Array])) == true });
    test(function() { return isinstance([], tuple([Array, Number])) == true });

    test(function() { return isinstance([], tuple([Number, String])) == false });

    var t = tuple([1, 2, 3]);

    test(function() { return isinstance(t, Array) == false });
    test(function() { return isinstance(t, Number) == false });
    test(function() { return isinstance(t, String) == false });

    test(function() { return isinstance(t, tuple()) == false });

    test(function() { return isinstance(t, tuple([Number, Array])) == false });
    test(function() { return isinstance(t, tuple([Array, Number])) == false });

    test(function() { return isinstance(t, tuple([Number, String])) == false });

    test(function() { return isinstance(t, _tuple) == true });
    test(function() { return isinstance(t, _list) == false });
    test(function() { return isinstance(t, _dict) == false });

    test(function() { return isinstance(t, tuple([Number, _tuple])) == true });
    test(function() { return isinstance(t, tuple([_tuple, Number])) == true });

    test(function() { return isinstance(t, tuple([_list, _dict])) == false });
}

function test_exceptions() {
    var e = new py.NotImplementedError('not implemented');

    test(function() { return e.__class__.__name__ == 'NotImplementedError' });
    test(function() { return e.message == 'not implemented' });

    var e = new py.ZeroDivisionError('division by zero');

    test(function() { return e.__class__.__name__ == 'ZeroDivisionError' });
    test(function() { return e.message == 'division by zero' });

    var e = new py.AssertionError('assertion error');

    test(function() { return e.__class__.__name__ == 'AssertionError' });
    test(function() { return e.message == 'assertion error' });

    var e = new py.AttributeError('attribute error');

    test(function() { return e.__class__.__name__ == 'AttributeError' });
    test(function() { return e.message == 'attribute error' });

    var e = new py.RuntimeError('runtime error');

    test(function() { return e.__class__.__name__ == 'RuntimeError' });
    test(function() { return e.message == 'runtime error' });

    var e = new py.ImportError('import error');

    test(function() { return e.__class__.__name__ == 'ImportError' });
    test(function() { return e.message == 'import error' });

    var e = new py.TypeError('type error');

    test(function() { return e.__class__.__name__ == 'TypeError' });
    test(function() { return e.message == 'type error' });

    var e = new py.ValueError('value error');

    test(function() { return e.__class__.__name__ == 'ValueError' });
    test(function() { return e.message == 'value error' });

    var e = new py.NameError('name error');

    test(function() { return e.__class__.__name__ == 'NameError' });
    test(function() { return e.message == 'name error' });

    var e = new py.IndexError('index error');

    test(function() { return e.__class__.__name__ == 'IndexError' });
    test(function() { return e.message == 'index error' });

    var e = new py.KeyError('key error');

    test(function() { return e.__class__.__name__ == 'KeyError' });
    test(function() { return e.message == 'key error' });

    var e = new py.StopIteration('stop iteration');

    test(function() { return e.__class__.__name__ == 'StopIteration' });
    test(function() { return e.message == 'stop iteration' });
}

function test_slice() {
    var s = slice(3);
    test(function() { return s.start == null });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple([0, 3, 1])) });
    test(function() { return s.indices(3).__eq__(tuple([0, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple([0, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple([0, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple([0, 0, 1])) });

    var t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8, 9, 10])) });
    t = tuple([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8, 9])) });
    t = tuple([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list([8, 9, 10])) });
    t = list([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list([8, 9])) });
    t = list([8]);
    test(function() { return t.__getitem__(s).__eq__(list([8])) });

    s = slice(null);
    test(function() { return s.start == null });
    test(function() { return s.stop == null });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple([0, 10, 1])) });
    test(function() { return s.indices(3).__eq__(tuple([0, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple([0, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple([0, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple([0, 0, 1])) });

    var t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8, 9, 10, 11, 12])) });
    t = tuple([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8, 9])) });
    t = tuple([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple([8])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list([8, 9, 10, 11, 12])) });
    t = list([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list([8, 9])) });
    t = list([8]);
    test(function() { return t.__getitem__(s).__eq__(list([8])) });

    s = slice(1, 3);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 3 });
    test(function() { return s.step == null });
    test(function() { return s.indices(10).__eq__(tuple([1, 3, 1])) });
    test(function() { return s.indices(3).__eq__(tuple([1, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple([1, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple([1, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple([0, 0, 1])) });

    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple([9, 10])) });
    t = tuple([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple([9])) });
    t = tuple([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list([9, 10])) });
    t = list([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list([9])) });
    t = list([8]);
    test(function() { return t.__getitem__(s).__eq__(list([])) });

    s = slice(1, 10, 2);
    test(function() { return s.start == 1 });
    test(function() { return s.stop == 10 });
    test(function() { return s.step == 2 });
    test(function() { return s.indices(10).__eq__(tuple([1, 10, 2])) });
    test(function() { return s.indices(3).__eq__(tuple([1, 3, 2])) });
    test(function() { return s.indices(2).__eq__(tuple([1, 2, 2])) });
    test(function() { return s.indices(1).__eq__(tuple([1, 1, 2])) });
    test(function() { return s.indices(0).__eq__(tuple([0, 0, 2])) });

    t = tuple([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(tuple([9, 11, 13])) });
    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple([9, 11])) });
    t = tuple([8, 9, 10]);
    test(function() { return t.__getitem__(s).__eq__(tuple([9])) });
    t = tuple([8]);
    test(function() { return t.__getitem__(s).__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(list([9, 11, 13])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list([9, 11])) });
    t = list([8, 9, 10]);
    test(function() { return t.__getitem__(s).__eq__(list([9])) });
    t = list([8]);
    test(function() { return t.__getitem__(s).__eq__(list([])) });

    s = slice(4, 6, 1);
    test(function() { return s.start == 4 });
    test(function() { return s.stop == 6 });
    test(function() { return s.step == 1 });
    test(function() { return s.indices(10).__eq__(tuple([4, 6, 1])) });
    test(function() { return s.indices(6).__eq__(tuple([4, 6, 1])) });
    test(function() { return s.indices(5).__eq__(tuple([4, 5, 1])) });
    test(function() { return s.indices(4).__eq__(tuple([4, 4, 1])) });
    test(function() { return s.indices(3).__eq__(tuple([3, 3, 1])) });
    test(function() { return s.indices(2).__eq__(tuple([2, 2, 1])) });
    test(function() { return s.indices(1).__eq__(tuple([1, 1, 1])) });
    test(function() { return s.indices(0).__eq__(tuple([0, 0, 1])) });

    t = tuple([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(tuple([12, 13])) });
    t = tuple([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(tuple([12])) });
    t = tuple([8, 9, 10, 11]);
    test(function() { return t.__getitem__(s).__eq__(tuple([])) });
    t = tuple([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(tuple([])) });
    t = list([8, 9, 10, 11, 12, 13, 14]);
    test(function() { return t.__getitem__(s).__eq__(list([12, 13])) });
    t = list([8, 9, 10, 11, 12]);
    test(function() { return t.__getitem__(s).__eq__(list([12])) });
    t = list([8, 9, 10, 11]);
    test(function() { return t.__getitem__(s).__eq__(list([])) });
    t = list([8, 9]);
    test(function() { return t.__getitem__(s).__eq__(list([])) });
}

function test_to_js() {
    var t = to_js(tuple([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = to_js(list([1, "s"]));
    test(function() { return t.length == 2 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });

    t = to_js(dict({1: "s", 2: 3}));
    test(function() { return t[1] == "s" });
    test(function() { return t[2] == 3 });

    var t = to_js(tuple([1, "s", dict({1: "s", 2: 3})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });

    var t = to_js(tuple([1, "s", dict({1: "s", 2: 3, "x": tuple([8, 9])})]));
    test(function() { return t.length == 3 });
    test(function() { return t[0] == 1 });
    test(function() { return t[1] == "s" });
    test(function() { return t[2][1] == "s" });
    test(function() { return t[2][2] == 3 });
    test(function() { return t[2]["x"][0] == 8 });
    test(function() { return t[2]["x"][1] == 9 });
}

function tests() {
    try {
        test_dict();
        test_iter();
        test_tuple();
        test_list();
        test_range();
        test_map();
        test_zip();
        test_isinstance();
        test_exceptions();
        test_slice();
        test_to_js();
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
