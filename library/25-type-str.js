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

$PY.basestring = basestring;

basestring.PY$__init__ = function(s) {
    if (s === undefined) {
        this.obj = '';
    } else if (typeof s === "string") {
        this.obj = s;
    } else if (s.toString !== undefined) {
        this.obj = s.toString();
    } else {
        this.obj = js(s);
    }
};

var __basestring_real__ = basestring.PY$__create__;

basestring.PY$__create__ = function(cls, obj) {
    if ($PY.isinstance(obj, basestring) == true) {
        return obj;
    } else if (obj.PY$__class__ === undefined && obj.PY$__super__ !== undefined) {
        return object.PY$__repr__.apply(obj);
    } else if (obj.PY$__str__ !== undefined) {
        return obj.PY$__str__();
    } else {
        return __basestring_real__(cls, obj);
    }
};

basestring.PY$__str__ = function () {
    return this;
};

basestring.PY$__repr__ = function () {
    return "'" + this + "'";
};

basestring._js_ = function () {
    return this.obj;
};

basestring.PY$__hash__ = function () {
    var value = 0x345678;
    var length = this.PY$__len__();

    for (var index in this.obj) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ this.obj[index];
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

basestring.PY$__len__ = function() {
    return int(this.obj.length);
};

basestring.PY$__iter__ = function() {
    return iter(this.obj);
};

basestring.PY$__mod__ = function(args) {
    return basestring(sprintf(this, args));
};

basestring.PY$__eq__ = function(s) {
    if (typeof(s) === "string")
        return bool(this.obj == s);
    else if ($PY.isinstance(s, $PY.basestring) == true) {
        return bool(this.obj == s.obj);
    }
    else
        return False;
};

basestring.PY$__gt__ = function(s) {
    if (typeof(s) === "string")
        return bool(this.obj > s);
    else if ($PY.isinstance(s, $PY.basestring) == true)
        return bool(this.obj > s.obj);
    else if ($PY.isinstance(s, $PY.tuple) == true)
        return False;
    else
        return True;
};

basestring.PY$__lt__ = function(s) {
    if (typeof(s) === "string")
        return bool(this.obj < s);
    else if ($PY.isinstance(s, $PY.basestring) == true)
        return bool(this.obj < s.obj);
    else if ($PY.isinstance(s, $PY.tuple) == true)
        return True;
    else
        return False;
};

basestring.PY$__contains__ = function(item) {
    for (var index in this.obj) {
        if (item == this.obj[index]) {
            return True;
        }
    }

    return False;
};

basestring.PY$__getitem__ = function(index) {
    var seq;
    if ($PY.isinstance(index, slice) == true) {
        var s = index;
        var inds = js(s.PY$indices(py_builtins.len(this)));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        seq = "";
        for (var i = start; i < stop; i += step) {
            seq = seq + js(this.PY$__getitem__(i));
        }
        return this.PY$__class__(seq);
    } else if ((index >= 0) && (index < js(py_builtins.len(this))))
        return this.obj[index];
    else if ((index < 0) && (index >= -js(py_builtins.len(this))))
        return this.obj[index+js(py_builtins.len(this))];
    else
        throw py_builtins.IndexError("string index out of range");
};

basestring.PY$__setitem__ = function() {
    throw py_builtins.TypeError("'str' object doesn't support item assignment");
};

basestring.PY$__delitem__ = function() {
    throw py_builtins.TypeError("'str' object doesn't support item deletion");
};

basestring.PY$__mul__ = function(c) {
    if ($PY.isinstance(c, int) == true) {
        var max = js(c);
        var res = "";
        for (var i = 0; i < max; i++) {
            res += this.obj;
        }
        return basestring(res);
    } else {
        throw py_builtins.TypeError(sprintf("Cannot multiply string and <%s>", c.PY$__class__.PY$__name__));
    }
};

basestring.PY$__add__ = function(c) {
    if ($PY.isinstance(c, basestring) == true) {
        return this.PY$__class__(this.obj + c.PY$__str__());
    } else {
        throw py_builtins.TypeError(sprintf("Cannot add string and <%s>", c.PY$__class__.PY$__name__));
    }
};

basestring.PY$__iadd__ = basestring.PY$__add__;

basestring.PY$count = function(needle, start, end) {
    if (start === undefined)
        start = 0;
    if (end === undefined)
        end = null;
    var count = 0;
    var s = this.PY$__getitem__(slice(start, end));
    var idx = s.PY$find(needle);
    while (idx != -1) {
        count += 1;
        s = s.PY$__getitem__(slice(idx+1, null));
        idx = s.PY$find(needle);
    }
    return count;
};

basestring.PY$index = function(value, start, end) {
    if (start === undefined) {
        start = 0;
    }

    for (var i = js(start); (end === undefined) || (start < end); i++) {
        var _value = this.obj[i];

        if (_value === undefined) {
            break;
        }

        if (_value == value) {
            return int(i);
        }
    }

    throw py_builtins.ValueError("substring not found");
};

basestring.PY$find = function(s) {
    return this.obj.search(s);
};

basestring.PY$rfind = function(s) {
    return int(this.obj.lastIndexOf(js(s)));
};

basestring.PY$join = function(s) {
    return this.PY$__class__(js(s).join(js(this)));
};

basestring.PY$replace = function(old, _new, count) {
    old = js(old);
    _new = js(_new);
    var old_s;
    var new_s;

    if (count !== undefined)
        count = js(count);
    else
        count = -1;
    old_s = "";
    new_s = this.obj;
    while ((count != 0) && (new_s != old_s)) {
        old_s = new_s;
        new_s = new_s.replace(old, _new);
        count -= 1;
    }
    return this.PY$__class__(new_s);
};

basestring.PY$lstrip = function(chars) {
    if (js(py_builtins.len(this)) === 0)
        return this;
    if (chars !== undefined)
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = 0;
    while ((i < js(py_builtins.len(this))) && (js(chars.PY$__contains__(this.PY$__getitem__(i))))) {
        i += 1;
    }
    return this.PY$__getitem__(slice(i, null));
};

basestring.PY$rstrip = function(chars) {
    if (js(py_builtins.len(this)) === 0)
        return this;
    if (chars !== undefined)
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = js(py_builtins.len(this))-1;
    while ((i >= 0) && (js(chars.PY$__contains__(this.PY$__getitem__(i))))) {
        i -= 1;
    }
    return this.PY$__getitem__(slice(i+1));
};

basestring.PY$strip = function(chars) {
    return this.PY$lstrip(chars).PY$rstrip(chars);
};

basestring.PY$split = function(sep) {
    var r_new;
    if (sep !== undefined) {
        var r = list(this.obj.split(sep));
        r_new = list([]);
        var that = this;
        iterate(r, function(item) {
                    r_new.PY$append(that.PY$__class__(item));
        });
        return r_new;
    } else {
        r_new = list([]);
        iterate(this.PY$split(" "), function(item) {
                if (py_builtins.len(item) > 0)
                    r_new.PY$append(item);
        });
        return r_new;
    }
};

basestring.PY$splitlines = function() {
    return this.PY$split("\n");
};

basestring.PY$lower = function() {
    return this.PY$__class__(this.obj.toLowerCase());
};

basestring.PY$upper = function() {
    return this.PY$__class__(this.obj.toUpperCase());
};

basestring.PY$encode = function() {
    return this;
};

basestring.PY$decode = function() {
    return this;
};

var str = __inherit(basestring, "str");
var unicode = __inherit(basestring, "unicode");

$PY.str = str;
$PY.unicode = unicode;

unicode.PY$__create__ = function(cls, obj) {
    if (obj.PY$__unicode__ !== undefined) {
        return obj.PY$__unicode__();
    } else {
        return basestring.PY$__create__(cls, obj);
    }
};
