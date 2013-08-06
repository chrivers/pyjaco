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

var tuple = __inherit(object, "tuple");

__builtins__.PY$tuple = tuple;

tuple.PY$__init__ = function(self, seq) {
    if (arguments.length > 2) {
        throw __builtins__.PY$TypeError("tuple() takes at most 1 argument (" + arguments.length + " given)");
    } else if (seq === undefined) {
        self.items = [];
    } else if (seq.PY$__class__ === list || seq.PY$__class__ === tuple) {
        self.items = seq.items.concat();
    } else {
        self.items = [];
        iterate(seq, function(elm) {
                    if (typeof elm === 'number')
                        self.items.push(int(elm));
                    else if (typeof elm === 'string')
                        self.items.push(str(elm));
                    else
                        self.items.push(elm);
                });
    }
};

tuple.PY$__str__ = function(self) {
    if (self.items.length === 0) {
        return str("()");
    } else if (self.items.length === 1) {
        return str("(" + js(__builtins__.PY$repr(self.items[0])) + ",)");
    } else {
        var res = "(" + js(__builtins__.PY$repr(self.items[0]));
        for (var i = 1; i < self.items.length; i++)  {
            res += ", " + js(__builtins__.PY$repr(self.items[i]));
        }
        return str(res + ")");
    }
};

tuple.PY$__repr__ = tuple.PY$__str__;

tuple.PY$__eq__ = function(self, other) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__eq__(self, other);
    }
    if (other.PY$__class__ === self.PY$__class__) {
        if (self.items.length != js(__builtins__.PY$len(other))) {
            return False;
        }
        for (var i = 0; i < self.items.length; i++) {
            if (self.items[i].PY$__ne__(other.items[i]) === True) {
                return False;
            }
        }
        return True;
    } else {
        return False;
    }
};

tuple.PY$__cmp__ = function(self, other) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__cmp__(self, other);
    }
    if (other.PY$__class__ !== self.PY$__class__) {
        if (object.PY$__gt__(self, other) === True) {
            return $c1;
        } else {
            if (object.PY$__lt__(self, other) === True) {
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
            if ($PY.isinstance(exc, __builtins__.PY$TypeError)) {
                return $c1;
            } else {
                throw exc;
            }
        }

        while (true) {
            try {
                var elm = it.PY$next(it);
            } catch (exc) {
                if (exc === $PY.c_stopiter || $PY.isinstance(exc, __builtins__.PY$StopIteration)) {
                    break;
                } else {
                    throw exc;
                }
            }
            if (count >= self.items.length) {
                res = $cn1;
                break;
            }
            var r = self.items[count].PY$__cmp__(elm);

            if (r.PY$__gt__($c0) === True) {
                res = $c1;
                break;
            } else if (r.PY$__lt__($c0) === True) {
                res = $cn1;
                break;
            }
            count++;
        }

        if (res === $c0) {
            if (self.items.length > count) {
                return $c1;
            } else {
                return $c0;
            }
        } else {
            return res;
        }
    }
};

tuple.PY$__gt__ = function(self, other) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__gt__(self, other);
    } else {
        return self.PY$__cmp__(other).PY$__gt__($c0);
    }
};

tuple.PY$__lt__ = function(self, other) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__lt__(self, other);
    } else {
        return self.PY$__cmp__(other).PY$__lt__($c0);
    }
};

tuple.PY$__mul__ = function(self, num) {
    if ($PY.isinstance(num, int)) {
        var res = [];
        var count = num._js_();
        for (var i = 0; i < count; i++) {
            res = res.concat(self.items);
        }
        return self.PY$__class__(res);
    } else {
        var name = self.PY$__class__.PY$__name__;
        throw __builtins__.PY$NotImplementedError("Cannot multiply " + name + " and non-int");
    }
};

tuple.PY$__add__ = function(self, other) {
    if (self.PY$__class__ === other.PY$__class__) {
        var res = self.items.slice();
        iterate(other, function(elm) {
                    res.push(elm);
                });
        return self.PY$__class__(res);
    } else {
        var name = self.PY$__class__.PY$__name__;
        throw __builtins__.PY$NotImplementedError("Cannot add " + name + " and non-" + name);
    }
};

tuple._js_ = function() {
    var items = [];

    iterate(this, function(item) {
        items.push(js(item));
    });

    return items;
};

tuple.PY$__hash__ = function (self) {
    /*
     * This hash implementation is based on the CPython
     * implementation, except that it doesn't special-case -1 -> -2.
     *
     * So it's not the same, but hash values are not portable between
     * implementations anyway. For example, PyPy differs from CPython,
     * but works just fine. The reason we (roughly) use CPythons hash
     * implementation is because it is well tested, and fairly simple.
     */
    var hash = 0x345678;
    var mult  = 1000003;
    var length = self.items.length;

    while (length--) {
        var y = __builtins__.PY$hash(self.items[length]);
        hash = (hash ^ y) * mult;
        mult += (82520 + length + length);
    }
    hash += 97531;

    return int(hash);
};

tuple.PY$__len__ = function(self) {
    return int(self.items.length);
};

tuple.PY$__iter__ = function(self) {
    return iter(self.items);
};

tuple.PY$__contains__ = function(self, item) {
    for (var index in self.items) {
        if (self.items[index].PY$__eq__(item) === True) {
            return True;
        }
    }

    return False;
};

tuple.PY$__getitem__ = function(self, index) {
    var seq;
    if ($PY.isinstance(index, slice)) {
        var s = index;
        var inds = js(s.PY$indices(self.items.length));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        seq = [];
        for (var i = start; i < stop; i += step) {
            seq.push(self.items[i]);
        }
        return self.PY$__class__(seq);
    } else {
        index = js(int(index));

        var len = self.items.length;
        if (index >= 0 && index < len) {
            return self.items[index];
        } else if (index < 0 && index >= -len) {
            return self.items[index + len];
        } else {
            throw __builtins__.PY$IndexError("list index out of range");
        }
    }
};

tuple.PY$__setitem__ = function(self) {
    throw __builtins__.PY$TypeError("'tuple' object doesn't support item assignment");
};

tuple.PY$__delitem__ = function(self) {
    throw __builtins__.PY$TypeError("'tuple' object doesn't support item deletion");
};

tuple.PY$count = function(self, value) {
    var count = 0;

    for (var index in self.items) {
        if (self.items[index].PY$__eq__(value) === True) {
            count += 1;
        }
    }

    return count;
};

tuple.PY$index = function(self, value, start, end) {
    if (start === undefined) {
        start = 0;
    } else {
        start = js(start);
    }
    end = js(end);

    for (var i = start; (end === undefined) || (start < end); i++) {
        var _value = self.items[i];

        if (_value === undefined) {
            break;
        }

        if (_value.PY$__eq__(value) === True) {
            return int(i);
        }
    }

    throw __builtins__.PY$ValueError(self.PY$__class__.PY$__name__ + ".index(x): x not in list");
};

__builtins__.PY$tuple = tuple;
$PY.$c_emptytuple = tuple();
