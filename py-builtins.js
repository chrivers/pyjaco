/* Python built-ins for JavaScript

   To run tests only, issue:

    $ js -f defs.js

   To run tests and go interactive, issue:

    $ js -f defs.js -f -

   Useful links:

    * https://developer.mozilla.org/En/SpiderMonkey/Introduction_to_the_JavaScript_shell

*/

var py = {};

py.__python3__ = false;

/* JavaScript helper functions */

function defined(obj) {
    return typeof(obj) != 'undefined';
}

function assert(cond, msg) {
    if (!cond) {
        throw new py.AssertionError(msg);
    }
}

function iterate(seq, func) {
    while (true) {
        try {
            func(seq.next());
        } catch (exc) {
            if (isinstance(exc, py.StopIteration)) {
                break;
            } else {
                throw exc;
            }
        }
    }
}

function copy(iterator) {
    var items = [];

    iterate(iterator, function(item) {
        items.push(item);
    });

    return items;
}

function _new(cls, arg) {
    return new cls(arg);
}

function js(obj) {
    /*
       Converts (recursively) a Python object to a javascript builtin object.

       In particular:

       tuple -> Array
       list -> Array
       dict -> Array

       It uses the obj._js_() if it is defined, otherwise it just returns the
       same object. It is the responsibility of _js_() to convert recursively
       the object itself.
    */
    if ((obj != null) && defined(obj._js_))
        return obj._js_();
    else
        return obj;
}

/* Python built-in exceptions */

py.__exceptions__ = [
    'NotImplementedError',
    'ZeroDivisionError',
    'AssertionError',
    'AttributeError',
    'RuntimeError',
    'ImportError',
    'TypeError',
    'ValueError',
    'NameError',
    'IndexError',
    'KeyError',
    'StopIteration'
];

for (var i in py.__exceptions__) {
    var name = py.__exceptions__[i];

    py[name] = function() {
        return function(message) {
            this.message = defined(message) ? message : "";
        };
    }();

    py[name].__name__ = name;
    py[name].prototype.__class__ = py[name];

    py[name].prototype.__str__ = function() {
        return str(js(this.__class__.__name__) + ": " + js(this.message));
    };

    py[name].prototype.toString = function() {
        return js(this.__str__());
    };
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
            throw new py.AttributeError(obj, name);
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
        throw new py.AttributeError(obj, '__hash__');
    }
}

function len(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.__len__();
    } else {
        throw new py.AttributeError(obj, '__name__');
    }
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

    if (py.__python3__)
        return iter(seq);
    else
        return list(seq);
}

function xrange(start, end, step) {
    return iter(range(start, end, step));
}

function map() {
    if (arguments.length < 2) {
        throw new py.TypeError("map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw new py.NotImplementedError("only one sequence allowed in map()");
    }

    var func = arguments[0];
    var seq = iter(arguments[1]);

    var items = list();

    iterate(seq, function(item) {
        items.append(func(item));
    });

    if (py.__python3__)
        return iter(items);
    else
        return items;
}

function zip() {
    if (!arguments.length) {
        return list();
    }

    var iters = list();
    var i;
    
    for (i = 0; i < arguments.length; i++) {
        iters.append(iter(arguments[i]));
    }

    var items = list();

    while (true) {
        var item = list();

        for (i = 0; i < arguments.length; i++) {
            try {
                var value = iters.__getitem__(i).next();
            } catch (exc) {
                if (isinstance(exc, py.StopIteration)) {
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
    if (cls instanceof _tuple) {
        var length = cls.__len__();

        if (length == 0) {
            return false;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.__getitem__(i);

            if (isinstance(obj, _cls)) {
                return true;
            }
        }

        return false;
    } else {
        if (defined(obj.__class__) && defined(cls.__name__)) {
            return obj.__class__ == cls;
        } else {
            return obj instanceof cls;
        }
    }
}

py.bool = function(a) {
    if ((a != null) && defined(a.__bool__))
        return a.__bool__();
    else {
        if (a)
            return true;
        else
            return false;
    }
};

py.eq = function(a, b) {
    if ((a != null) && defined(a.__eq__))
        return a.__eq__(b);
    else if ((b != null) && defined(b.__eq__))
        return b.__eq__(a);
    else
        return a == b;
};

py._int = function(value) {
    return value;
};

py._float = function(value) {
    return value;
};

py.max = function(list) {
    if (len(list) == 0)
        throw new py.ValueError("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result == null) || (item > result))
                    result = item;
        });

        return result;
    }
};

py.min = function(list) {
    if (len(list) == 0)
        throw new py.ValueError("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result == null) || (item < result))
                    result = item;
        });

        return result;
    }
};

py.sum = function(list) {
    var result = 0;

    iterate(iter(list), function(item) {
        result += item;
    });

    return result;
};

/* Python 'iter' type */

function iter(obj) {
    if (obj instanceof Array) {
        return new _iter(obj);
    } else if (typeof(obj) === "string") {
        return iter(obj.split(""));
    } else if (obj.__class__ == _iter) {
        return obj;
    } else if (defined(obj.__iter__)) {
        return obj.__iter__();
    } else {
        throw new py.TypeError("object is not iterable");
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
};

_iter.prototype.__str__ = function () {
    return str("<iter of " + this._seq + " at " + this._index + ">");
};

_iter.prototype.toString = function () {
    return js(this.__str__());
};

_iter.prototype.next = function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw new py.StopIteration('no more items');
    }
};

/* Python 'slice' object */

function slice(start, stop, step) {
    return new _slice(start, stop, step);
}

function _slice(start, stop, step) {
    this.__init__(start, stop, step);
}

_slice.__name__ = 'slice';
_slice.prototype.__class__ = _slice;

_slice.prototype.__init__ = function(start, stop, step) {
    if (!defined(stop) && !defined(step))
    {
        stop = start;
        start = null;
    }
    if (!start) start = null;
    if (!defined(stop)) stop = null;
    if (!defined(step)) step = null;
    this.start = start;
    this.stop = stop;
    this.step = step;
};

_slice.prototype.__str__ = function() {
    return str("slice(" + this.start + ", " + this.stop + ", " + this.step + ")");
};

_slice.prototype.indices = function(n) {
    var start = this.start;
    if (start == null)
        start = 0;
    if (start > n)
        start = n;
    var stop = this.stop;
    if (stop > n)
        stop = n;
    if (stop == null)
        stop = n;
    var step = this.step;
    if (step == null)
        step = 1;
    return tuple([start, stop, step]);
};

/* Python 'tuple' type */

function tuple(seq) {
    if (arguments.length <= 1) {
        return new _tuple(seq);
    } else {
        throw new py.TypeError("tuple() takes at most 1 argument (" + arguments.length + " given)");
    }
}

function _tuple(seq) {
    this.__init__(seq);
}

_tuple.__name__ = 'tuple';
_tuple.prototype.__class__ = _tuple;

_tuple.prototype.__init__ = function(seq) {
    if (!defined(seq)) {
        this._items = [];
        this._len = 0;
    } else {
        this._items = copy(iter(seq));
        this._len = -1;
    }
};

_tuple.prototype.__str__ = function () {
    if (this.__len__() == 1) {
        return str("(" + this._items[0] + ",)");
    } else {
        return str("(" + this._items.join(", ") + ")");
    }
};

_tuple.prototype.__eq__ = function (other) {
    if (other.__class__ == this.__class__) {
        if (len(this) != len(other))
            return false;
        for (var i = 0; i < len(this); i++) {
            // TODO: use __eq__ here as well:
            if (this._items[i] != other._items[i])
                return false;
        }
        return true;
        // This doesn't take into account hash collisions:
        //return hash(this) == hash(other)
    } else
        return false;
};

_tuple.prototype.toString = function () {
    return js(this.__str__());
};

_tuple.prototype._js_ = function () {
    var items = [];

    iterate(iter(this), function(item) {
        items.push(js(item));
    });

    return items;
};

_tuple.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._items) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._items[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

_tuple.prototype.__len__ = function() {
    if (this._len == -1) {
        var count = 0;

        for (var index in this._items) {
            count += 1;
        }

        this._len = count;
        return count;
    } else
        return this._len;
};

_tuple.prototype.__iter__ = function() {
    return new _iter(this._items);
};

_tuple.prototype.__contains__ = function(item) {
    for (var index in this._items) {
        if (py.eq(item, this._items[index])) {
            return true;
        }
    }

    return false;
};

_tuple.prototype.__getitem__ = function(index) {
    var seq;
    if (isinstance(index, _slice)) {
        var s = index;
        var inds = s.indices(len(this));
        var start = inds.__getitem__(0);
        var stop = inds.__getitem__(1);
        var step = inds.__getitem__(2);
        seq = [];
        for (var i = start; i < stop; i += step) {
            seq.push(this.__getitem__(i));
        }
        return new this.__class__(seq);
    } else if ((index >= 0) && (index < len(this)))
        return this._items[index];
    else if ((index < 0) && (index >= -len(this)))
        return this._items[index+len(this)];
    else
        throw new py.IndexError("list assignment index out of range");
};

_tuple.prototype.__setitem__ = function(index, value) {
    throw new py.TypeError("'tuple' object doesn't support item assignment");
};

_tuple.prototype.__delitem__ = function(index) {
    throw new py.TypeError("'tuple' object doesn't support item deletion");
};

_tuple.prototype.count = function(value) {
    var count = 0;

    for (var index in this._items) {
        if (value == this._items[index]) {
            count += 1;
        }
    }

    return count;
};

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

    throw new py.ValueError("tuple.index(x): x not in list");
};

/* Python 'list' type */

function list(seq) {
    if (arguments.length <= 1) {
        return new _list(seq);
    } else {
        throw new py.TypeError("list() takes at most 1 argument (" + arguments.length + " given)");
    }
}

function _list(seq) {
    this.__init__(seq);
}

_list.__name__ = 'list';
_list.prototype.__class__ = _list;

_list.prototype.__init__ = _tuple.prototype.__init__;

_list.prototype.__str__ = function () {
    return str("[" + this._items.join(", ") + "]");
};

_list.prototype.__eq__ = _tuple.prototype.__eq__;

_list.prototype.toString = _tuple.prototype.toString;

_list.prototype._js_ = _tuple.prototype._js_;

_list.prototype.__len__ = _tuple.prototype.__len__;

_list.prototype.__iter__ = _tuple.prototype.__iter__;

_list.prototype.__contains__ = _tuple.prototype.__contains__;

_list.prototype.__getitem__ = _tuple.prototype.__getitem__;

_list.prototype.__setitem__ = function(index, value) {
    if ((index >= 0) && (index < len(this)))
        this._items[index] = value;
    else if ((index < 0) && (index >= -len(this)))
        this._items[index+len(this)] = value;
    else
        throw new py.IndexError("list assignment index out of range");
};

_list.prototype.__delitem__ = function(index) {
    if ((index >= 0) && (index < len(this))) {
        var a = this._items.slice(0, index);
        var b = this._items.slice(index+1, len(this));
        this._items = a.concat(b);
        this._len = -1;
    } else
        throw new py.IndexError("list assignment index out of range");
};

_list.prototype.count = _tuple.prototype.count;

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

        if (defined(_value.__eq__)) {
            if (_value.__eq__(value))
                return i;
        }
    }

    throw new py.ValueError("list.index(x): x not in list");
};

_list.prototype.remove = function(value) {
    this.__delitem__(this.index(value));
};

_list.prototype.append = function(value) {
    this._items.push(value);
    this._len = -1;
};

_list.prototype.extend = function(l) {
    var items;
    items = this._items;
    iterate(iter(l), function(item) {
        items.push(item);
    });
    this._len = -1;
};

_list.prototype.pop = function() {
    if (len(this) > 0) {
        this._len = -1;
        return this._items.pop();
    } else
        throw new py.IndexError("pop from empty list");
};

_list.prototype.sort = function() {
    this._items.sort();
};

_list.prototype.insert = function(index, x) {
    var a = this._items.slice(0, index)
    var b = this._items.slice(index, len(this))
    this._items = a.concat([x], b)
    this._len = -1;
}

_list.prototype.reverse = function() {
    var new_list = list([]);
    iterate(iter(this), function(item) {
            new_list.insert(0, item);
    });
    this._items = new_list._items;
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
    var items;
    var key;
    var value;
    
    if (defined(args)) {
        if (defined(args.__iter__)) {
            items = {};
            iterate(iter(args), function(item) {
                    key = js(item.__getitem__(0));
                    value = item.__getitem__(1);
                    items[key] = value;
            });
            this._items = items;
        }
        else
            this._items = args;
    } else {
        this._items = {};
    }
};

_dict.prototype.__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(js(str(key)) + ": " + js(str(this._items[key])));
    }

    return str("{" + strings.join(", ") + "}");
};

_dict.prototype.toString = function () {
    return js(this.__str__());
};

_dict.prototype._js_ = function () {
    var items = {};

    var _this_dict = this; // so that we can access it from within the closure:
    iterate(iter(this), function(key) {
        items[key] = js(_this_dict.__getitem__(key));
    });

    return items;
};

_dict.prototype.__hash__ = function () {
    throw new py.TypeError("unhashable type: 'dict'");
};

_dict.prototype.__len__ = function() {
    var count = 0;

    for (var key in this._items) {
        count += 1;
    }

    return count;
};

_dict.prototype.__iter__ = function() {
    return new _iter(this.keys());
};

_dict.prototype.__contains__ = function(key) {
    return defined(this._items[key]);
};

_dict.prototype.__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw new py.KeyError(str(key));
    }
};

_dict.prototype.__setitem__ = function(key, value) {
    this._items[key] = value;
};

_dict.prototype.__delitem__ = function(key) {
    if (this.__contains__(key)) {
        delete this._items[key];
    } else {
        throw new py.KeyError(str(key));
    }
};

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
};

_dict.prototype.items = function() {
    var items = [];

    for (var key in this._items) {
        items.push([key, this._items[key]]);
    }

    return items;
};

_dict.prototype.keys = function() {
    var keys = [];

    for (var key in this._items) {
        keys.push(key);
    }

    return keys;
};

_dict.prototype.values = function() {
    var values = [];

    for (var key in this._items) {
        values.push(this._items[key]);
    }

    return values;
};

_dict.prototype.update = function(other) {
    for (var key in other) {
        this._items[key] = other[key];
    }
};

_dict.prototype.clear = function() {
    for (var key in this._items) {
        delete this._items[key];
    }
};

_dict.prototype.pop = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw new py.KeyError(str(key));
        }
    }

    return _value;
};

_dict.prototype.popitem = function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw new py.KeyError("popitem(): dictionary is empty");
    }
};

/* Python 'str' type */

function str(s) {
    return new _str(s);
}

function _str(s) {
    this.__init__(s);
}

_str.__name__ = 'str';
_str.prototype.__class__ = _str;

_str.prototype.__init__ = function(s) {
    if (!defined(s)) {
        this._obj = '';
    } else {
        if (typeof(s) === "string") {
            this._obj = s;
        } else if (defined(s.toString)) {
            this._obj = s.toString();
        } else if (defined(s.__str__)) {
            this._obj = js(s.__str__());
        } else
            this._obj = js(s);
    }
};

_str.prototype.__str__ = function () {
    return this;
};

_str.prototype.__eq__ = function (other) {
    if (other.__class__ == this.__class__) {
        if (len(this) != len(other))
            return false;
        for (var i = 0; i < len(this); i++) {
            if (this._obj[i] != other._obj[i])
                return false;
        }
        return true;
    } else
        return false;
};

_str.prototype.toString = function () {
    return js(this.__str__());
};

_str.prototype._js_ = function () {
    return this._obj;
};

_str.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._obj) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._obj[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

_str.prototype.__len__ = function() {
    return this._obj.length;
};

_str.prototype.__iter__ = function() {
    return iter(this._obj);
};

_str.prototype.__bool__ = function() {
    return py.bool(this._obj);
};

_str.prototype.__eq__ = function(s) {
    if (typeof(s) === "string")
        return this._obj == s;
    else if (isinstance(s, _str))
        return this._obj == s._obj;
    else
        return false;
};

_str.prototype.__contains__ = function(item) {
    for (var index in this._obj) {
        if (item == this._obj[index]) {
            return true;
        }
    }

    return false;
};

_str.prototype.__getitem__ = function(index) {
    
    var seq;
    if (isinstance(index, _slice)) {
        var s = index;
        var inds = s.indices(len(this));
        var start = inds.__getitem__(0);
        var stop = inds.__getitem__(1);
        var step = inds.__getitem__(2);
        seq = "";
        for (var i = start; i < stop; i += step) {
            seq = seq + js(this.__getitem__(i));
        }
        return new this.__class__(seq);
    } else if ((index >= 0) && (index < len(this)))
        return this._obj[index];
    else if ((index < 0) && (index >= -len(this)))
        return this._obj[index+len(this)];
    else
        throw new py.IndexError("string index out of range");
};

_str.prototype.__setitem__ = function(index, value) {
    throw new py.TypeError("'str' object doesn't support item assignment");
};

_str.prototype.__delitem__ = function(index) {
    throw new py.TypeError("'str' object doesn't support item deletion");
};

_str.prototype.count = function(value) {
    var count = 0;

    for (var index in this._obj) {
        if (value == this._obj[index]) {
            count += 1;
        }
    }

    return count;
};

_str.prototype.index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._obj[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return i;
        }
    }

    throw new py.ValueError("substring not found");
};

_str.prototype.find = function(s) {
    return this._obj.search(s);
};

_str.prototype.rfind = function(s) {
    rev = function(s) {
        var a = list(str(s));
        a.reverse();
        a = str("").join(a);
        return a;
    }
    var a = rev(this);
    var b = rev(s);
    var r = a.find(b);
    if (r == -1)
        return r;
    return len(this)-len(b)-r
}

_str.prototype.join = function(s) {
    return str(js(s).join(js(this)));
}

_str.prototype.replace = function(old, _new, count) {
    old = js(old);
    _new = js(_new);
    var old_s;
    var new_s;

    if (defined(count))
        count = js(count);
    else
        count = -1;
    old_s = "";
    new_s = this._obj;
    while ((count != 0) && (new_s != old_s)) {
        old_s = new_s;
        new_s = new_s.replace(old, _new);
        count -= 1;
    }
    return new_s;
};

_str.prototype.lstrip = function(chars) {
    if (len(this) == 0)
        return this;
    if (defined(chars))
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = 0;
    while ((i < len(this)) && (chars.__contains__(this.__getitem__(i)))) {
        i += 1;
    }
    return this.__getitem__(slice(i, null));
};

_str.prototype.rstrip = function(chars) {
    if (len(this) == 0)
        return this
    if (defined(chars))
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = len(this)-1;
    while ((i >= 0) && (chars.__contains__(this.__getitem__(i)))) {
        i -= 1;
    }
    return this.__getitem__(slice(i+1));
};

_str.prototype.split = function(sep) {
    if (defined(sep)) {
        var r = list(this._obj.split(sep));
        var r_new = list([]);
        iterate(iter(r), function(item) {
                r_new.append(str(item));
        });
        return r_new;
    }
    else {
        var r_new = list([]);
        iterate(iter(this.split(" ")), function(item) {
                if (len(item) > 0)
                    r_new.append(item);
        });
        return r_new;
    }
};

_str.prototype.splitlines = function() {
    return this.split("\n");
};
