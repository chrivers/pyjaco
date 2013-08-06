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

var basestring = __inherit(object, "basestring");

__builtins__.PY$basestring = basestring;

basestring.PY$__init__ = function(self, s) {
    if (s === undefined) {
        self.obj = '';
    } else if (typeof s === "string") {
        self.obj = s;
    } else if (s.toString !== undefined) {
        self.obj = s.toString();
    } else {
        self.obj = js(s);
    }
};

var __basestring_real__ = basestring.PY$__create__;

basestring.PY$__create__ = function(cls, obj) {
    if (obj === undefined) bt();
    if ($PY.isinstance(obj, basestring)) {
        return obj;
    } else if (obj.PY$__class__ === undefined && obj.PY$__super__ !== undefined) {
        return object.PY$__repr__(obj);
    } else if (obj.PY$__str__ !== undefined) {
        return obj.PY$__str__(obj);
    } else {
        return __basestring_real__(cls, obj);
    }
};

basestring.PY$__str__ = function(self) {
    if (self.PY$__class__) {
        return self;
    } else {
        return object.PY$__str__.apply(self);
    }
};

basestring.PY$__repr__ = function(self) {
    if (self.PY$__class__) {
        return self.PY$__class__("'" + self.obj + "'");
    } else {
        return object.PY$__repr__.apply(self);
    }
};

basestring._js_ = function() {
    return this.obj;
};

basestring.PY$__hash__ = function (self) {
    /*
     * This hash implementation is based on the CPython
     * implementation, except that it cannot produce the same results
     * for non-pathological strings. This is because JavaScript uses
     * 64-bit floats as numbers, and it seems XOR is not defined
     * correctly above 2^32, even though the integral numbers go as
     * high as 2^53.
     *
     * We might support true hashes in the future, with a proper
     * implementation of the long-type.
     */
    if (self.obj === "") {
        return $c0;
    }
    var len = this.obj.length;

    var hash = this.obj.charCodeAt(0) << 7;
    for (var i = 0; i < len; i++) {
        hash = (1000003 * hash) ^ this.obj.charCodeAt(i);
    }
    hash ^= len;
    return int(hash);
};

basestring.PY$__len__ = function(self) {
    return int(self.obj.length);
};

basestring.PY$__iter__ = function(self) {
    return iter(self.obj);
};

basestring.PY$__mod__ = function(self, args) {
    return basestring(sprintf(self, args));
};

basestring.PY$__eq__ = function(self, s) {
    if (self.PY$__class__ === undefined)
        return object.PY$__eq__.call(self, s);
    else if (typeof(s) === "string")
        return self.obj === s ? True : False;
    else if ($PY.isinstance(s, __builtins__.PY$basestring))
        return self.obj === s.obj ? True : False;
    else
        return False;
};

basestring.PY$__gt__ = function(self, s) {
    if (self.PY$__class__ === undefined)
        return object.PY$__gt__.call(self, s);
    else if (typeof(s) === "string")
        return self.obj > s ? True : False;
    else if ($PY.isinstance(s, __builtins__.PY$basestring))
        return self.obj > s.obj ? True : False;
    else if ($PY.isinstance(s, __builtins__.PY$tuple))
        return False;
    else
        return True;
};

basestring.PY$__lt__ = function(self, s) {
    if (self.PY$__class__ === undefined)
        return object.PY$__lt__.call(self, s);
    if (typeof(s) === "string")
        return self.obj < s ? True : False;
    else if ($PY.isinstance(s, __builtins__.PY$basestring))
        return self.obj < s.obj ? True : False;
    else if ($PY.isinstance(s, __builtins__.PY$tuple))
        return True;
    else
        return False;
};

basestring.PY$__contains__ = function(self, item) {
    for (var index in self.obj) {
        if (item === self.obj[index]) {
            return True;
        }
    }

    return False;
};

basestring.PY$__getitem__ = function(self, index) {
    var seq;
    index = js(index);
    if ($PY.isinstance(index, slice)) {
        var s = index;
        var inds = js(s.PY$indices(self.obj.length));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        if (step != 1) {
            seq = "";
            for (var i = start; i < stop; i += step) {
                seq = seq + js(self.obj.charAt(i));
            }
            return self.PY$__class__(seq);
        } else {
            return self.PY$__class__(self.obj.slice(start, stop));
        }
    } else if ((index >= 0) && (index < self.obj.length))
        return self.obj.charAt(index);
    else if ((index < 0) && (index >= -self.obj.length))
        return self.obj.charAt(index + self.obj.length);
    else
        throw __builtins__.PY$IndexError("string index out of range");
};

basestring.PY$__setitem__ = function(self) {
    throw __builtins__.PY$TypeError("'str' object doesn't support item assignment");
};

basestring.PY$__delitem__ = function(self) {
    throw __builtins__.PY$TypeError("'str' object doesn't support item deletion");
};

basestring.PY$__mul__ = function(self, c) {
    if ($PY.isinstance(c, int)) {
        var max = js(c);
        var res = "";
        for (var i = 0; i < max; i++) {
            res += self.obj;
        }
        return basestring(res);
    } else {
        throw __builtins__.PY$TypeError(sprintf("Cannot multiply string and <%s>", c.PY$__class__.PY$__name__));
    }
};

basestring.PY$__add__ = function(self, c) {
    if ($PY.isinstance(c, basestring)) {
        return self.PY$__class__(self.obj + c.PY$__str__(c)._js_());
    } else {
        throw __builtins__.PY$TypeError(sprintf("Cannot add string and <%s>", c.PY$__class__.PY$__name__));
    }
};

basestring.PY$__iadd__ = basestring.PY$__add__;

basestring.PY$count = function(self, needle, start, end) {
    if (start === undefined) {
        start = 0;
    } else {
      start = js(start);
    }
    if (end === undefined)
        end = null;
    else
        end = js(end);
    var count = 0;
    var s = self.PY$__getitem__(slice(start, end));
    var idx = js(s.PY$find(needle));
    while (idx != -1) {
        count += 1;
        s = s.PY$__getitem__(slice(idx+1, null));
        idx = js(s.PY$find(needle));
    }
    return count;
};

basestring.PY$index = function(self, value, start, end) {
    if (start === undefined) {
        start = 0;
    }

    for (var i = js(start); (end === undefined) || (start < end); i++) {
        var _value = self.obj[i];

        if (_value === undefined) {
            break;
        }

        if (_value === value) {
            return int(i);
        }
    }

    throw __builtins__.PY$ValueError("substring not found");
};

basestring.PY$find = function(self, s) {
    return int(self.obj.indexOf(js(s)));
};

basestring.PY$rfind = function(self, s) {
    return int(self.obj.lastIndexOf(js(s)));
};

basestring.PY$join = function(self, s) {
    // return self.PY$__class__(js(s).join(js(self)));
    var res = "";
    iterate(s, function(elm) {
                if (res != "")
                    res += self.obj;
                res += str(elm)._js_();
            });
    return str(res);
};

basestring.PY$replace = function(self, old, _new, count) {
    old = js(old);
    _new = js(_new);
    var old_s;
    var new_s;

    if (count !== undefined)
        count = js(count);
    else
        count = -1;
    old_s = "";
    new_s = self.obj;
    while ((count != 0) && (new_s != old_s)) {
        old_s = new_s;
        new_s = new_s.replace(old, _new);
        count -= 1;
    }
    return self.PY$__class__(new_s);
};

basestring.PY$lstrip = function(self, chars) {
    if (self.obj.length === 0)
        return self;
    if (chars !== undefined)
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = 0;
    while ((i < self.obj.length) && (js(chars.PY$__contains__(self.PY$__getitem__(i))))) {
        i += 1;
    }
    return self.PY$__getitem__(slice(i, null));
};

basestring.PY$rstrip = function(self, chars) {
    if (self.obj.length === 0)
        return self;
    if (chars !== undefined)
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = self.obj.length - 1;
    while ((i >= 0) && (js(chars.PY$__contains__(self.PY$__getitem__(i))))) {
        i -= 1;
    }
    return self.PY$__getitem__(slice(i+1));
};

basestring.PY$strip = function(self, chars) {
    return self.PY$lstrip(chars).PY$rstrip(chars);
};

basestring.PY$split = function(self, sep, max) {
    var r_new;
    if (sep === undefined) {
        var strings = self.obj.split(/\s+/);
        for (var x = 0; x < strings.length; x++) {
            strings[x] = str(strings[x]);
        };
        return list(strings);
    } else {
        sep = js(sep);
    }
    if (max === undefined) {
        max = 0xFFFFFFFF;
    } else {
        max = js(max);
        if (max === 0) {
            return list([self]);
        }
    }
    r_new = list();
    var i = -sep.length;
    var c = 0;
    var q = 0;
    while (c < max) {
        i = self.obj.indexOf(sep, i + sep.length);
        if (i === -1) {
            break;
        }
        r_new.PY$append(self.PY$__class__(self.obj.substring(q, i)));
        q = i + sep.length;
        c++;
    }
    r_new.PY$append(self.PY$__class__(self.obj.substring(q)));
    return r_new;
};

basestring.PY$splitlines = function(self) {
    return self.PY$split("\n");
};

basestring.PY$lower = function(self) {
    return self.PY$__class__(self.obj.toLowerCase());
};

basestring.PY$upper = function(self) {
    return self.PY$__class__(self.obj.toUpperCase());
};

basestring.PY$encode = function(self) {
    return self;
};

basestring.PY$decode = function(self) {
    return self;
};

basestring.PY$startswith = function(self, other) {
    return bool(self.obj.indexOf(js(other)) === 0);
};

basestring.PY$endswith = function(self, other) {
    var x = js(other);
    var i = self.obj.lastIndexOf(x);
    return (i !== -1 && i === (self.obj.length - x.length)) ? True : False;
};

var str = __inherit(basestring, "str");
var unicode = __inherit(basestring, "unicode");

__builtins__.PY$str = str;
__builtins__.PY$unicode = unicode;

unicode.PY$__create__ = function(self, cls, obj) {
    if (obj.PY$__unicode__ !== undefined) {
        return obj.PY$__unicode__(obj);
    } else {
        return basestring.PY$__create__(cls, obj);
    }
};
