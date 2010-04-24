/* Python built-ins for JavaScript

   To run tests only, issue:

    $ js -f defs.js

   To run tests and go interactive, issue:

    $ js -f defs.js -f -

   Useful links:

    * https://developer.mozilla.org/En/SpiderMonkey/Introduction_to_the_JavaScript_shell

*/

/* JavaScript helper functions */

function defined(obj) {
    return typeof(obj) != 'undefined';
}

function assert(cond, msg) {
    if (!cond) {
        throw new AssertionError(msg);
    }
}

function _new(cls, arg) {
    return new cls(arg)
}

/* Python built-in exceptions */

function AttributeError(obj, name) {
    this.message = "'" + obj.__class__.__name__ + "' object has not attribute '" + name + "'";
}

AttributeError.__name__ = 'AttributeError';
AttributeError.prototype.__class__ = AttributeError

function AssertionError(message) {
    this.message = defined(message) ? message : "";
}

AssertionError.__name__ = 'AssertionError';
AssertionError.prototype.__class__ = AssertionError

function KeyError(message) {
    this.message = defined(message) ? message : "";
}

KeyError.__name__ = 'KeyError';
KeyError.prototype.__class__ = KeyError

function NameError(message) {
    this.message = defined(message) ? message : "";
}

NameError.__name__ = 'NameError';
NameError.prototype.__class__ = NameError

function TypeError(message) {
    this.message = defined(message) ? message : "";
}

TypeError.__name__ = 'TypeError';
TypeError.prototype.__class__ = TypeError

TypeError.prototype.__str__ = function () {
    return this.__class__.__name__ + ": " + this.message;
}

TypeError.prototype.toString = function () {
    return this.__str__();
}

function StopIteration(message) {
    this.message = defined(message) ? message : "";
}

StopIteration.__name__ = 'StopIteration';
StopIteration.prototype.__class__ = StopIteration

StopIteration.prototype.__str__ = function () {
    return this.__class__.__name__ + ": " + this.message;
}

StopIteration.prototype.toString = function () {
    return this.__str__();
}

function IndexError(message) {
    this.message = defined(message) ? message : "";
}

IndexError.__name__ = 'IndexError';
IndexError.prototype.__class__ = IndexError

IndexError.prototype.__str__ = function () {
    return this.__class__.__name__ + ": " + this.message;
}

IndexError.prototype.toString = function () {
    return this.__str__();
}

function ValueError(message) {
    this.message = defined(message) ? message : "";
}

ValueError.__name__ = 'ValueError';
ValueError.prototype.__class__ = ValueError

ValueError.prototype.__str__ = function () {
    return this.__class__.__name__ + ": " + this.message;
}

ValueError.prototype.toString = function () {
    return this.__str__();
}

function NotImplementedError(message) {
    this.message = defined(message) ? message : "";
}

NotImplementedError.__name__ = 'NotImplementedError';
NotImplementedError.prototype.__class__ = NotImplementedError

NotImplementedError.prototype.__str__ = function () {
    return this.__class__.__name__ + ": " + this.message;
}

NotImplementedError.prototype.toString = function () {
    return this.__str__();
}

/* Python built-in functions */

function hasattr(obj, name) {
    return defined(obj[name]);
}

function getattr(obj, name, value) {
    var _value = obj[name];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            throw new AttributeError(obj, name);
        }
    }
}

function setattr(obj, name, value) {
    obj[name] = value;
}

function hash(obj) {
    if (hasattr(obj, '__hash__')) {
        return obj.__hash__();
    } else if (typeof(obj) == 'number') {
        return obj == -1 ? -2 : obj;
    } else {
        throw new AttributeError(obj, '__hash__');
    }
}

function len(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.__len__();
    } else {
        throw new AttributeError(obj, '__name__');
    }
}

function str(obj) {
    return obj.toString();
}

function range(start, end, step) {
    if (!defined(end)) {
        end = start;
        start = 0;
    }

    if (!defined(step)) {
        step = 1;
    }

    var seq = [];

    for (var i = start; i < end; i += step) {
        seq.push(i);
    }

    // python3.0:
    return new _iter(seq)
    // python2.x:
    //return list(seq);
}

function map() {
    if (arguments.length < 2) {
        throw new TypeError("map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw new NotImplementedError("only one sequence allowed in map()");
    }

    var func = arguments[0];
    var seq = iter(arguments[1]);

    var result = list();

    while (true) {
        try {
            result.append(func(seq.next()));
        } catch (exc) {
            if (isinstance(exc, StopIteration)) {
                return result; // XXX: this is Python 2.x
            } else {
                throw exc;
            }
        }
    }
}

function zip() {
    if (!arguments.length) {
        return list();
    }

    var iters = list();

    for (var i = 0; i < arguments.length; i++) {
        iters.append(iter(arguments[i]));
    }

    var items = list();

    while (true) {
        var item = list();

        for (var i = 0; i < arguments.length; i++) {
            try {
                var value = iters.__getitem__(i).next();
            } catch (exc) {
                if (isinstance(exc, StopIteration)) {
                    return items;
                } else {
                    throw exc;
                }
            }

            item.append(value);
        }

        items.append(tuple(item));
    }
}

function isinstance(obj, cls) {
    if (defined(obj.__class__)) {
        // XXX: add support for tuple syntax
        return obj.__class__ == cls;
    } else {
        return false;
    }
}

/* Python 'iter' type */

function iter(obj) {
    if (obj.__class__ == _iter) {
        return obj;
    } else if (defined(obj.__iter__)) {
        return obj.__iter__();
    } else {
        throw new TypeError("'__iter__' method not supported");
    }
}

function _iter(seq) {
    this.__init__(seq);
}

_iter.__name__ = 'iter';
_iter.prototype.__class__ = _iter;

_iter.prototype.__init__ = function(seq) {
    this._seq = seq;
    this._index = 0;
}

_iter.prototype.__str__ = function () {
    return "<iter of " + this._seq + " at " + this._index + ">";
}

_iter.prototype.toString = function () {
    return this.__str__();
}

_iter.prototype.next = function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw new StopIteration('no more items');
    }
}

/* Python 'tuple' type */

function tuple(args) {
    return new _tuple(args);
}

function _tuple(args) {
    this.__init__(args);
}

_tuple.__name__ = 'tuple';
_tuple.prototype.__class__ = _tuple;

_tuple.prototype.__init__ = function(args) {
    if (defined(args)) {
        var i = null;
        try {
            i  = iter(args);
        } catch (TypeError) {
            // let's hope that args is an Array
            this._items = args;
        }
        if (i != null) {
            var seq = [];
            try {
                while (true) {
                    seq.push(i.next());
                }
            } catch (StopIteration) {
                // pass
            }
            this._items = seq;
        }
    } else {
        this._items = [];
    }
}

_tuple.prototype.__str__ = function () {
    if (this.__len__() == 1) {
        return "(" + this._items[0] + ",)";
    } else {
        return "(" + this._items.join(", ") + ")";
    }
}

_tuple.prototype.toString = function () {
    return this.__str__();
}

_tuple.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._items) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._items[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2
    }

    return value
}

_tuple.prototype.__len__ = function() {
    var count = 0;

    for (var index in this._items) {
        count += 1;
    }

    return count;
}

_tuple.prototype.__iter__ = function() {
    return new _iter(this._items);
}

_tuple.prototype.__contains__ = function(item) {
    for (var index in this._items) {
        if (item == this._items[index]) {
            return true;
        }
    }

    return false;
}

_tuple.prototype.__getitem__ = function(index) {
    if ((index >= 0) && (index < len(this)))
        return this._items[index]
    else if ((index < 0) && (index >= -len(this)))
        return this._items[index+len(this)]
    else
        throw new IndexError("list assignment index out of range");
}

_tuple.prototype.__setitem__ = function(index, value) {
    throw new TypeError("'tuple' object doesn't support item assignment");
}

_tuple.prototype.__delitem__ = function(index) {
    throw new TypeError("'tuple' object doesn't support item deletion");
}

_tuple.prototype.count = function(value) {
    var count = 0;

    for (var index in this._items) {
        if (value == this._items[index]) {
            count += 1;
        }
    }

    return count;
}

_tuple.prototype.index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._items[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return i;
        }
    }

    throw new ValueError("tuple.index(x): x not in list");
}

/* Python 'list' type */

function list(args) {
    return new _list(args);
}

function _list(args) {
    this.__init__(args);
}

_list.__name__ = 'list';
_list.prototype.__class__ = _list;

_list.prototype.__init__ = function(args) {
    if (defined(args)) {
        var i = null;
        try {
            i  = iter(args);
        } catch (TypeError) {
            // let's hope that args is an Array
            this._items = args;
        }
        if (i != null) {
            var seq = [];
            try {
                while (true) {
                    seq.push(i.next());
                }
            } catch (StopIteration) {
                // pass
            }
            this._items = seq;
        } else
            this._items = args;
    } else {
        this._items = [];
    }
    this._len = -1;
}

_list.prototype.__str__ = function () {
    return "[" + this._items.join(", ") + "]";
}

_list.prototype.toString = function () {
    return this.__str__();
}

_list.prototype.__len__ = function() {
    if (this._len == -1) {
        var count = 0;

        for (var index in this._items) {
            count += 1;
        }

        this._len = count;
        return count;
    } else
        return this._len;
}

_list.prototype.__iter__ = function() {
    return new _iter(this._items);
}

_list.prototype.__contains__ = function(item) {
    for (var index in this._items) {
        if (item == this._items[index]) {
            return true;
        }
    }

    return false;
}

_list.prototype.__getitem__ = function(index) {
    if ((index >= 0) && (index < len(this)))
        return this._items[index]
    else if ((index < 0) && (index >= -len(this)))
        return this._items[index+len(this)]
    else
        throw new IndexError("list assignment index out of range");
}

_list.prototype.__setitem__ = function(index, value) {
    if ((index >= 0) && (index < len(this)))
        this._items[index] = value
    else if ((index < 0) && (index >= -len(this)))
        this._items[index+len(this)] = value
    else
        throw new IndexError("list assignment index out of range");
}

_list.prototype.__delitem__ = function(index) {
    if ((index >= 0) && (index < len(this))) {
        var a = this._items.slice(0, index)
        var b = this._items.slice(index+1, len(this))
        this._items = a.concat(b)
        this._len = -1;
    } else
        throw new IndexError("list assignment index out of range");
}

_list.prototype.count = function(value) {
    var count = 0;

    for (var index in this._items) {
        if (value == this._items[index]) {
            count += 1;
        }
    }

    return count;
}

_list.prototype.index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._items[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return i;
        }
    }

    throw new ValueError("list.index(x): x not in list");
}

_list.prototype.append = function(value) {
    this._items.push(value)
    this._len = -1;
}

/* Python 'dict' type */

function dict(args) {
    return new _dict(args);
}

function _dict(args) {
    this.__init__(args);
}

_dict.__name__ = 'dict';
_dict.prototype.__class__ = _dict;

_dict.prototype.__init__ = function(args) {
    if (defined(args)) {
        this._items = args;
    } else {
        this._items = {};
    }
}

_dict.prototype.__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(str(key) + ": " + str(this._items[key]));
    }

    return "{" + strings.join(", ") + "}";
}

_dict.prototype.toString = function () {
    return this.__str__();
}

_dict.prototype.__hash__ = function () {
    throw new TypeError("unhashable type: 'dict'");
}

_dict.prototype.__len__ = function() {
    var count = 0;

    for (var key in this._items) {
        count += 1;
    }

    return count;
}

_dict.prototype.__iter__ = function() {
    return new _iter(this.keys());
}

_dict.prototype.__contains__ = function(key) {
    return defined(this._items[key]);
}

_dict.prototype.__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw new KeyError(str(key));
    }
}

_dict.prototype.__setitem__ = function(key, value) {
    this._items[key] = value;
}

_dict.prototype.__delitem__ = function(key) {
    if (this.__contains__(key)) {
        delete this._items[key];
    } else {
        throw new KeyError(str(key));
    }
}

_dict.prototype.get = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            return null;
        }
    }
}

_dict.prototype.items = function() {
    var items = [];

    for (var key in this._items) {
        items.push([key, this._items[key]]);
    }

    return items;
}

_dict.prototype.keys = function() {
    var keys = [];

    for (var key in this._items) {
        keys.push(key);
    }

    return keys;
}

_dict.prototype.values = function() {
    var values = [];

    for (var key in this._items) {
        values.push(this._items[key]);
    }

    return values;
}

_dict.prototype.update = function(other) {
    for (var key in other) {
        this._items[key] = other[key];
    }
}

_dict.prototype.clear = function() {
    for (var key in this._items) {
        delete this._items[key];
    }
}

_dict.prototype.pop = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw new KeyError(str(key));
        }
    }

    return _value;
}

_dict.prototype.popitem = function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw new KeyError("popitem(): dictionary is empty");
    }
}

/* TESTS */

function test(code) {
    if (!code()) {
        throw new AssertionError("test failed: " + code);
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
            throw new AssertionError(name + " exception was thrown in " + code);
        }
    }

    throw new AssertionError("did not raise " + exc.__name__ + " in " + code);
}

function test_dict() {
    var d = dict();

    test(function() { return str(d) == '{}' });
    test(function() { return len(d) == 0 });

    raises(KeyError, function() { d.popitem() });

    raises(KeyError, function() { d.pop(0) });
    raises(KeyError, function() { d.__getitem__(0) });
    raises(KeyError, function() { d.__delitem__(0) });

    raises(KeyError, function() { d.pop('a') });
    raises(KeyError, function() { d.__getitem__('a') });
    raises(KeyError, function() { d.__delitem__('a') });

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
    var d = dict({0: 1, 1: 2, 2: 3});
    var i = iter(d);

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });

    raises(StopIteration, function() { i.next() });

    var t = tuple([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(StopIteration, function() { i.next() });

    var t = list([7, 3, 5]);
    var i = iter(t);

    test(function() { return i.next() == 7 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 5 });

    raises(StopIteration, function() { i.next() });

    var i = iter(range(5));

    test(function() { return i.next() == 0 });
    test(function() { return i.next() == 1 });
    test(function() { return i.next() == 2 });
    test(function() { return i.next() == 3 });
    test(function() { return i.next() == 4 });

    raises(StopIteration, function() { i.next() });
}

function test_tuple() {
    var t = tuple();

    test(function() { return str(t) == '()' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(IndexError, function() { t.__getitem__(0) });

    raises(TypeError, function() { t.__setitem__(7, 0) });
    raises(TypeError, function() { t.__delitem__(7) });

    raises(ValueError, function() { t.index(5) });
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
    raises(IndexError, function() { t.__getitem__(7) });
    raises(IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1 });
    test(function() { return t.__getitem__(-2) == 4 });
    test(function() { return t.__getitem__(-3) == 4 });
    test(function() { return t.__getitem__(-4) == 5 });
    test(function() { return t.__getitem__(-5) == 5 });
    test(function() { return t.__getitem__(-6) == 4 });
    test(function() { return t.__getitem__(-7) == 3 });
    raises(IndexError, function() { t.__getitem__(-8) });
    raises(IndexError, function() { t.__getitem__(-9) });

    raises(TypeError, function() { t.__setitem__(7, 0) });
    raises(TypeError, function() { t.__delitem__(7) });

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
    var t = list();

    test(function() { return str(t) == '[]' });
    test(function() { return len(t) == 0 });

    test(function() { return t.__contains__(5) == false });
    raises(IndexError, function() { t.__getitem__(0) });

    raises(IndexError, function() { t.__setitem__(7, 0) });
    raises(IndexError, function() { t.__delitem__(7) });

    raises(ValueError, function() { t.index(5) });
    test(function() { return t.count(5) == 0 });

    raises(AttributeError, function() { return hash(t) });

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
    raises(IndexError, function() { t.__getitem__(7) });
    raises(IndexError, function() { t.__getitem__(8) });
    test(function() { return t.__getitem__(-1) == 1 });
    test(function() { return t.__getitem__(-2) == 4 });
    test(function() { return t.__getitem__(-3) == 4 });
    test(function() { return t.__getitem__(-4) == 5 });
    test(function() { return t.__getitem__(-5) == 5 });
    test(function() { return t.__getitem__(-6) == 4 });
    test(function() { return t.__getitem__(-7) == 3 });
    raises(IndexError, function() { t.__getitem__(-8) });
    raises(IndexError, function() { t.__getitem__(-9) });

    raises(IndexError, function() { t.__setitem__(7, 0) });
    raises(IndexError, function() { t.__delitem__(7) });

    test(function() { return t.index(5) == 2 });
    test(function() { return t.count(5) == 2 });

    raises(AttributeError, function() { return hash(t) });

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
    raises(IndexError, function() { t.__delitem__(4) });

    t.__setitem__(0, 1);
    test(function() { return str(t) == '[1, 4, 4, 1]' });
    t.__setitem__(1, 2);
    test(function() { return str(t) == '[1, 2, 4, 1]' });
    t.__setitem__(2, 3);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.__setitem__(3, 4);
    test(function() { return str(t) == '[1, 2, 3, 4]' });
    raises(IndexError, function() { t.__setitem__(4, 5) });
    raises(IndexError, function() { t.__setitem__(5, 6) });
    t.__setitem__(-1, 1);
    test(function() { return str(t) == '[1, 2, 3, 1]' });
    t.__setitem__(-2, 2);
    test(function() { return str(t) == '[1, 2, 2, 1]' });
    t.__setitem__(-3, 3);
    test(function() { return str(t) == '[1, 3, 2, 1]' });
    t.__setitem__(-4, 4);
    test(function() { return str(t) == '[4, 3, 2, 1]' });
    raises(IndexError, function() { t.__setitem__(-5, 5) });
    raises(IndexError, function() { t.__setitem__(-6, 6) });


    t = list([1, 2, 3, 4])
    test(function() { return str(t) == '[1, 2, 3, 4]' })
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

    raises(TypeError, function() { map(f) });
    raises(NotImplementedError, function() { map(f, a, a) });
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
        return isinstance(new StopIteration(), StopIteration) == true;
    });

    test(function() {
        return isinstance(new StopIteration(), ValueError) == false;
    });
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

