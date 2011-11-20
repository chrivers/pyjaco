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

$PY.tuple = tuple;

tuple.PY$__init__ = function(seq) {
    if (arguments.length > 1) {
        throw py_builtins.TypeError("tuple() takes at most 1 argument (" + arguments.length + " given)");
    } else if (!defined(seq)) {
        this._items = [];
    } else if (seq.PY$__class__ === list || seq.PY$__class__ === tuple) {
        this._items = [];
        for (var i = 0; i < seq._items.length; i++) {
            this._items.push(seq._items[i]);
        }
    } else {
        var that = this;
        this._items = [];
        iterate(seq, function(elm) {
                    if (typeof(elm) == 'number')
                        that._items.push(int(elm));
                    else if (typeof(elm) == 'string')
                        that._items.push(str(elm));
                    else
                        that._items.push(elm);
                });
    }
};

tuple.PY$__str__ = function () {
    if (js(this.PY$__len__()) === 0) {
        return str("()");
    } else if (js(this.PY$__len__()) == 1) {
        return str("(" + str(this._items[0]) + ",)");
    } else {
        var res = "(";
        for (var i = 0; i < this._items.length; i++)  {
            if (i != 0) {
                res += ", ";
            }
            res += js(this._items[i].PY$__repr__());
        }
        return res + ")";
    }
};

tuple.PY$__repr__ = tuple.PY$__str__;

tuple.PY$__eq__ = function (other) {
    if (other.PY$__class__ == this.PY$__class__) {
        if (js(py_builtins.len(this)) != js(py_builtins.len(other))) {
            return False;
        }
        var len = js(py_builtins.len(this));
        for (var i = 0; i < len; i++) {
            if (this._items[i].PY$__ne__(other._items[i]) == true) {
                return False;
            }
        }
        return True;
    } else {
        return False;
    }
};

tuple.PY$__cmp__ = function (other) {
    if (other.PY$__class__ !== this.PY$__class__) {
        if (object.PY$__gt__.call(this, other) == true) {
            return $c1;
        } else {
            if (object.PY$__lt__.call(this, other) == true) {
                return $cn1;
            } else {
                return $c0;
            }
        }
    } else {
        var count = 0;
        var res = $c0;
        try {
            var it = iter(other);
        } catch (exc) {
            if (py_builtins.isinstance(exc, py_builtins.TypeError)) {
                return $c1;
            } else {
                throw exc;
            }
        }

        while (true) {
            try {
                var elm = it.PY$next();
            } catch (exc) {
                if (py_builtins.isinstance(exc, py_builtins.StopIteration)) {
                    break;
                } else {
                    throw exc;
                }
            }
            if (count >= this._items.length) {
                res = $cn1;
                break;
            }
            var r = this._items[count].PY$__cmp__(elm);

            if (r.PY$__gt__($c0) == true) {
                res = $c1;
                break;
            } else if (r.PY$__lt__($c0) == true) {
                res = $cn1;
                break;
            }
            count++;
        }

        if (res == 0) {
            if (this._items.length > count) {
                return $c1;
            } else {
                return $c0;
            }
        } else {
            return res;
        }
    }
};

tuple.PY$__gt__ = function (other) {
    return this.PY$__cmp__(other).PY$__gt__($c0);
};

tuple.PY$__lt__ = function (other) {
    return this.PY$__cmp__(other).PY$__lt__($c0);
};

tuple._js_ = function () {
    var items = [];

    iterate(this, function(item) {
        items.push(js(item));
    });

    return items;
};

tuple.PY$__hash__ = function () {
    var value = 0x345678;
    var length = js(this.PY$__len__());

    for (var index in this._items) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ py_builtins.hash(this._items[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

tuple.PY$__len__ = function() {
    return int(this._items.length);
};

tuple.PY$__iter__ = function() {
    return iter(this._items);
};

tuple.PY$__contains__ = function(item) {
    for (var index in this._items) {
        if (this._items[index].PY$__eq__(item) == true) {
            return True;
        }
    }

    return False;
};

tuple.PY$__getitem__ = function(index) {
    if (typeof(index) === 'number') index = int(index);
    var seq;
    if (py_builtins.isinstance(index, slice) == true) {
        var s = index;
        var inds = js(s.PY$indices(py_builtins.len(this)));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        seq = [];
        for (var i = start; i < stop; i += step) {
            seq.push(this.PY$__getitem__(i));
        }
        return this.PY$__class__(seq);
    } else {
        if (py_builtins.isinstance(index, int) == false) {
            index = int(index);
        }

        if (js(index.PY$__ge__($c0)) && js(index.PY$__lt__(py_builtins.len(this)))) {
            return this._items[index.PY$__int__()];
        } else if (js(index.PY$__lt__($c0)) && js(index.PY$__ge__(py_builtins.len(this).PY$__neg__()))) {
            return this._items[index.PY$__add__(py_builtins.len(this)).PY$__int__()];
        } else {
            throw py_builtins.IndexError("list index out of range");
        }
    }
};

tuple.PY$__setitem__ = function() {
    throw py_builtins.TypeError("'tuple' object doesn't support item assignment");
};

tuple.PY$__delitem__ = function() {
    throw py_builtins.TypeError("'tuple' object doesn't support item deletion");
};

tuple.PY$count = function(value) {
    var count = 0;

    for (var index in this._items) {
        if (this._items[index].PY$__eq__(value) == true) {
            count += 1;
        }
    }

    return count;
};

tuple.PY$index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._items[i];

        if (!defined(_value)) {
            break;
        }

        if (_value.PY$__eq__(value) == true) {
            return int(i);
        }
    }

    throw py_builtins.ValueError(this.PY$__class__.PY$__name__ + ".index(x): x not in list");
};
