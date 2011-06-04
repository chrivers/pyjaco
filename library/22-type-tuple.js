/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
  Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
  Copyright 2011 Christian Iversen <ci@sikkerhed.org>

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
**/

var tuple = __inherit(object, "tuple");

tuple.prototype.__init__ = function(seq) {

    if (arguments.length > 1) {
        throw py_builtins.TypeError.__call__("tuple() takes at most 1 argument (" + arguments.length + " given)");
    } else if (!defined(seq)) {
        this._items = [];
    } else {
        this._items = copy(iter.__call__(seq));
        for (var i = 0; i < this._items.length; i++) {
            if (typeof(this._items[i]) == 'number')
                this._items[i] = _int.__call__(this._items[i]);
            if (typeof(this._items[i]) == 'string')
                this._items[i] = str.__call__(this._items[i]);
        }
    }
};

tuple.prototype.__str__ = function () {
    if (js(this.__len__()) === 0) {
        return str.__call__("()");
    } else if (js(this.__len__()) == 1) {
        return str.__call__("(" + str.__call__(this._items[0]) + ",)");
    } else {
        var items = map(function (i) {return str.__call__(i);}, this._items);
        return str.__call__("(" + str.__call__(", ").join(items) + ")");
    }
};

tuple.prototype.__repr__ = tuple.prototype.__str__;

tuple.prototype.__eq__ = function (other) {
    if (other.__class__ == this.__class__) {
        if (js(len(this)) != js(len(other))) {
            return False;
        }
        for (var i = 0; i < js(len(this)); i++) {
            if (js(this._items[i].__ne__(other._items[i]))) {
                return False;
            }
        }
        return True;
        // This doesn't take into account hash collisions:
        //return hash(this) == hash(other)
    } else {
        return False;
    }
};

tuple.prototype._js_ = function () {
    var items = [];

    iterate(iter.__call__(this), function(item) {
        items.push(js(item));
    });

    return items;
};

tuple.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = js(this.__len__());

    for (var index in this._items) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._items[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

tuple.prototype.__len__ = function() {
    return _int.__call__(this._items.length);
};

tuple.prototype.__iter__ = function() {
    return iter.__call__(this._items);
};

tuple.prototype.__contains__ = function(item) {
    for (var index in this._items) {
        if (js(py_builtins.eq(item, this._items[index]))) {
            return True;
        }
    }

    return False;
};

tuple.prototype.__getitem__ = function(index) {
    if (typeof(index) === 'number') index = _int.__call__(index);
    var seq;
    if (isinstance.__call__(index, slice)) {
        var s = index;
        var inds = js(s.indices(len(this)));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        seq = [];
        for (var i = js(start); i < js(stop); i += js(step)) {
            seq.push(this.__getitem__(i));
        }
        return this.__class__.__call__(seq);
    } else if (js(index.__ge__(_int.__call__(0)).__and__(index.__lt__(len(this))))) {
        return this._items[index.__int__()];
    } else if (js(index.__lt__(_int.__call__(0)).__and__(index.__ge__(len(this).__neg__())))) {
        return this._items[index.__add__(len(this)).__int__()];
    } else {
        throw py_builtins.IndexError.__call__("list index out of range");
    }
};

tuple.prototype.__setitem__ = function(index, value) {
    throw py_builtins.TypeError.__call__("'tuple' object doesn't support item assignment");
};

tuple.prototype.__delitem__ = function(index) {
    throw py_builtins.TypeError.__call__("'tuple' object doesn't support item deletion");
};

tuple.prototype.count = Function(function(value) {
    var count = 0;

    for (var index in this._items) {
        if (js(this._items[index].__eq__(value))) {
            count += 1;
        }
    }

    return count;
});

tuple.prototype.index = Function(function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._items[i];

        if (!defined(_value)) {
            break;
        }

        if (js(_value.__eq__(value))) {
            return i;
        }
    }

    throw py_builtins.ValueError.__call__("tuple.index(x): x not in list");
});

