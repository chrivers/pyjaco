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

$PY.list = list;

list.PY$__init__ = tuple.PY$__init__;

list.PY$__str__ = function () {
    var len = js(this.PY$__len__());
    if (len === 0) {
        return str("[]");
    } else if (len === 1) {
        return str("[" + str(this.items[0]) + "]");
    } else {
        var res = "[" + js(py_builtins.repr(this.items[0]));
        for (var i = 1; i < this.items.length; i++)  {
            res += ", " + js(py_builtins.repr(this.items[i]));
        }
        return res + "]";
    }
};

list.PY$__eq__ = tuple.PY$__eq__;

list.PY$__cmp__ = tuple.PY$__cmp__;

list.PY$__gt__ = tuple.PY$__gt__;

list.PY$__lt__ = tuple.PY$__lt__;

list.PY$__mul__ = tuple.PY$__mul__;

list.PY$__add__ = tuple.PY$__add__;

list.PY$__repr__ = list.PY$__str__;

list._js_ = tuple._js_;

list.PY$__len__ = tuple.PY$__len__;

list.PY$__iter__ = tuple.PY$__iter__;

list.PY$__contains__ = tuple.PY$__contains__;

list.PY$__getitem__ = tuple.PY$__getitem__;

list.PY$__setitem__ = function(index, value) {
    if (typeof(index) === 'number') index = int(index);

    if (js(index.PY$__ge__($c0)) && js(index.PY$__lt__(py_builtins.len(this)))) {
        this.items[index.PY$__int__()] = value;
    } else if (js(index.PY$__lt__($c0)) && js(index.PY$__ge__(py_builtins.len(this).PY$__neg__()))) {
        this.items[index.PY$__add__(py_builtins.len(this)).PY$__int__()] = value;
    } else {
        throw py_builtins.IndexError("list index out of range");
    }
};
list.PY$__setslice__ = function(lower, upper, value) {
     var it = list(value).items;
     if (lower < py_builtins.len(this) && upper < py_builtins.len(this)) {
       this.items = this.items.slice(0,lower).concat(it).concat(this.items.slice(upper,py_builtins.len(this)));
       this.len = -1;
     }
};

list.PY$__delitem__ = function(index) {
    if (typeof(index) !== 'number') index = js(index);

    if ((index >= 0) && (index < py_builtins.len(this))) {
        var a = this.items.slice(0, index);
        var b = this.items.slice(index+1, py_builtins.len(this));
        this.items = a.concat(b);
        this.len = -1;
    } else
        throw py_builtins.IndexError("list assignment index out of range");
};

list.PY$__delslice__ = function(x, y) {
    if ((x >= 0) && (y < py_builtins.len(this))) {
        var a = this.items.slice(0, x);
        var b = this.items.slice(y);
        this.items = a.concat(b);
        this.len = -1;
    } else
        throw py_builtins.IndexError("list assignment index out of range");
};

list.PY$count = tuple.PY$count;

list.PY$index = tuple.PY$index;

list.PY$remove = function(value) {
    this.PY$__delitem__(this.PY$index(value));
};

list.PY$append = function(value) {
    if (typeof(value) === 'string') {
        this.items.push(str(value));
    } else if (typeof(value) === 'number') {
        this.items.push(int(value));
    } else {
        this.items.push(value);
    }
    this.len = -1;
};

list.PY$extend = function(l) {
    var items;
    items = this.items;
    iterate(l, function(item) {
        items.push(item);
    });
    this.len = -1;
};

list.PY$pop = function() {
    if (py_builtins.len(this) > 0) {
        this.len = -1;
        return this.items.pop();
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
    if (reverse == true) {
        mcmp = function(a, b) { return cmp(b, a); };
    } else {
        mcmp = function(a, b) { return cmp(a, b); };
    }

    this.items.sort(function (a, b) {return mcmp(key(a), key(b));});
};

list.PY$insert = function(index, x) {
    var a = this.items.slice(0, index);
    var b = this.items.slice(index, py_builtins.len(this));
    this.items = a.concat([x], b);
    this.len = -1;
};

list.PY$reverse = function() {
    var new_list = list([]);
    iterate(this, function(item) {
            new_list.PY$insert(0, item);
    });
    this.items = new_list.items;
};
