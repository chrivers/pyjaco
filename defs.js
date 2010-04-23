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
    } else {
        throw new AttributeError(obj, name);
    }
}

function len(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.__len__();
    } else {
        throw new AttributeError(obj, name);
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

    return new _iter(seq);
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
}

function tests() {
    try {
        test_dict();
        test_iter();
    } catch(e) {
        if (defined(e.message)) {
            print(e.__class__.__name__ + ": " + e.message);
        } else {
            print(e.__class__.__name__ + ": ");
        }

        throw "Tests failed"
    }
}

