/**
  Copyright 2011-2013 Christian Iversen <chrivers@iversen-net.dk>

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

__builtins__.PY$list = list;

list.PY$__init__ = tuple.PY$__init__;

list.PY$__str__ = function(self) {
    if (self.items.length === 0) {
        return str("[]");
    } else {
        var res = "[" + js(__builtins__.PY$repr(self.items[0]));
        for (var i = 1; i < self.items.length; i++)  {
            res += ", " + js(__builtins__.PY$repr(self.items[i]));
        }
        return str(res + "]");
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

list.PY$__setitem__ = function(self, index, value) {
    index = js(int(index));

    var len = self.items.length;
    if (index >= 0 && index < len) {
        self.items[index] = value;
    } else if (index < 0 && index >= -len) {
        self.items[index + len] = value;
    } else {
        throw __builtins__.PY$IndexError("list index out of range");
    }
};

list.PY$__setslice__ = function(self, lower, upper, value) {
    var it = list(value).items;
    lower = js(lower);
    upper = js(upper);
    if (lower < self.items.length && upper < self.items.length) {
        self.items = self.items.slice(0, lower).concat(it).concat(self.items.slice(upper, self.items.length));
    }
};

list.PY$__delitem__ = function(self, index) {
    if (typeof(index) !== 'number') index = js(index);

    if ((index >= 0) && (index < self.items.length)) {
        var a = self.items.slice(0, index);
        var b = self.items.slice(index+1, self.items.length);
        self.items = a.concat(b);
    } else
        throw __builtins__.PY$IndexError("list assignment index out of range");
};

list.PY$__delslice__ = function(self, x, y) {
    x = js(x);
    y = js(y);
    if ((x >= 0) && (y < self.items.length)) {
        var a = self.items.slice(0, x);
        var b = self.items.slice(y);
        self.items = a.concat(b);
    } else
        throw __builtins__.PY$IndexError("list assignment index out of range");
};

list.PY$count = tuple.PY$count;

list.PY$index = tuple.PY$index;

list.PY$remove = function(self, value) {
    self.PY$__delitem__(self.PY$index(value));
};

list.PY$append = function(self, value) {
    if (typeof(value) === 'string') {
        self.items.push(str(value));
    } else if (typeof(value) === 'number') {
        self.items.push(int(value));
    } else {
        self.items.push(value);
    }
};

list.PY$extend = function(self, l) {
    var items;
    items = self.items;
    iterate(l, function(item) {
        items.push(item);
    });
};

list.PY$pop = function(self, index) {
    if (self.items.length > 0) {
        var idx;
        var res;

        if (index === undefined) {
            idx = self.items.length - 1;
        } else {
            idx = index._js_();
        }

        if (idx === self.items.length - 1) {
            return self.items.pop();
        } else if (idx < 0 || idx >= self.items.length) {
            throw __builtins__.PY$IndexError("pop index out of range");
        } else if (idx == 0) {
            res = self.items[0];
            self.items = self.items.slice(1);
            return res;
        } else {
            res = self.items[idx];
            self.items = Array.prototype.concat(self.items.slice(0, idx), self.items.slice(idx + 1));
            return res;
        }

    } else {
        throw __builtins__.PY$IndexError("pop from empty list");
    }
};

list.PY$sort = function(self) {
    var pyargs = __uncook(arguments);
    var cmp = js(arguments[1]);
    if (cmp === undefined) { cmp = pyargs.kw.cmp === undefined ? function(a, b) { return js(a.PY$__cmp__(a, b));} : pyargs.kw.cmp; };

    var key = js(arguments[2]);
    if (key === undefined) { key = pyargs.kw.key === undefined ? function(x) { return x; } : pyargs.kw.key; };

    var reverse = arguments[3];
    if (reverse === undefined) { reverse = pyargs.kw.reverse === undefined ? False : pyargs.kw.reverse; };

    var direction = reverse === True ? -1 : 1;

    self.items.sort(function(a, b) {return js(cmp(key(a), key(b))) * direction;});
};

list.PY$insert = function(self, index, x) {
    var i = js(index);
    var a = self.items.slice(0, i);
    var b = self.items.slice(i);
    self.items = a.concat([x], b);
};

list.PY$reverse = function(self) {
    var new_list = list();
    iterate(self, function(item) {
            new_list.PY$insert(0, item);
    });
    self.items = new_list.items;
};
