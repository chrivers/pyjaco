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

var list = __inherit(object, "list");

list.PY$__init__ = tuple.PY$__init__;

list.PY$__str__ = function () {
    var items = map(function (i) {return repr(i);}, this._items);
    return str("[" + str(", ").PY$join(items) + "]");
};

list.PY$__eq__ = tuple.PY$__eq__;

list.PY$__repr__ = function () {
    var items = map(function (i) {return repr(i);}, this._items);
    return str("[" + str(", ").PY$join(items) + "]");
};

list._js_ = tuple._js_;

list.PY$__len__ = tuple.PY$__len__;

list.PY$__iter__ = tuple.PY$__iter__;

list.PY$__contains__ = tuple.PY$__contains__;

list.PY$__getitem__ = tuple.PY$__getitem__;

list.PY$__setitem__ = function(index, value) {
    if (typeof(index) === 'number') index = _int(index);

    if (js(index.PY$__ge__(_int(0)).PY$__and__(index.PY$__lt__(len(this))))) {
        this._items[index.PY$__int__()] = value;
    } else if (js(index.PY$__lt__(_int(0)).PY$__and__(index.PY$__ge__(len(this).PY$__neg__())))) {
        this._items[index.PY$__add__(len(this)).PY$__int__()] = value;
    } else {
        throw py_builtins.IndexError("list index out of range");
    }
};
list.PY$__setslice__ = function(lower, upper, value) {
     var it = list(value)._items;
     if (lower < len(this) && upper < len(this)) {
       this._items = this._items.slice(0,lower).concat(it).concat(this._items.slice(upper,len(this)));
       this._len = -1;
     }
};

list.PY$__delitem__ = function(index) {
    if (typeof(index) !== 'number') index = js(index);

    if ((index >= 0) && (index < len(this))) {
        var a = this._items.slice(0, index);
        var b = this._items.slice(index+1, len(this));
        this._items = a.concat(b);
        this._len = -1;
    } else
        throw py_builtins.IndexError("list assignment index out of range");
};

list.PY$__delslice__ = function(x, y) {
    if ((x >= 0) && (y < len(this))) {
        var a = this._items.slice(0, x);
        var b = this._items.slice(y);
        this._items = a.concat(b);
        this._len = -1;
    } else
        throw py_builtins.IndexError("list assignment index out of range");
};

list.PY$count = tuple.PY$count;

list.PY$index = function(value, start, end) {
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

        if (defined(_value.PY$__eq__)) {
            if (js(_value.PY$__eq__(value)))
                return i;
        }
    }

    throw py_builtins.ValueError("list.index(x): x not in list");
};

list.PY$remove = function(value) {
    this.PY$__delitem__(this.PY$index(value));
};

list.PY$append = function(value) {
    if (typeof(value) === 'string') {
        this._items.push(str(value));
    } else if (typeof(value) === 'number') {
        this._items.push(_int(value));
    } else {
        this._items.push(value);
    }
    this._len = -1;
};

list.PY$extend = function(l) {
    var items;
    items = this._items;
    iterate(iter(l), function(item) {
        items.push(item);
    });
    this._len = -1;
};

list.PY$pop = function() {
    if (len(this) > 0) {
        this._len = -1;
        return this._items.pop();
    } else
        throw py_builtins.IndexError("pop from empty list");
};

list.PY$sort = function() {
    var cmp = function(a, b) { return js(a.PY$__cmp__(b));};
    if (arguments.length > 0)
        cmp = js(arguments[0]);

    var key = function(x) { return x; };
    if (arguments.length > 1)
        key = js(arguments[1]);

    var reverse = False;
    if (arguments.length > 2)
        reverse = js(arguments[2]);

    var mcmp;
    if (js(reverse)) {
        mcmp = function(a, b) { return cmp(b, a); };
    } else {
        mcmp = function(a, b) { return cmp(a, b); };
    }

    this._items.sort(function (a, b) {return mcmp(key(a), key(b));});
};

list.PY$insert = function(index, x) {
    var a = this._items.slice(0, index);
    var b = this._items.slice(index, len(this));
    this._items = a.concat([x], b);
    this._len = -1;
};

list.PY$reverse = function() {
    var new_list = list([]);
    iterate(iter(this), function(item) {
            new_list.PY$insert(0, item);
    });
    this._items = new_list._items;
};
