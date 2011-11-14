/**
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

var __inherit = function(cls, name) {

    if (!defined(name)) {
        throw py_builtins.TypeError("The function __inherit must get exactly 2 arguments");
    }

    var res = function() {
        var x = res.PY$__create__;
        if (typeof x != 'undefined') {
            return res.PY$__create__.apply(null, [res].concat(Array.prototype.slice.call(arguments)));
        } else {
            throw py_builtins.AttributeError("Class " + name + " does not have __create__ method");
        }
    };

    if (typeof cls != 'undefined') {
        for (var o in cls) {
            res[o] = cls[o];
        }
    }

    if (typeof str != 'undefined') {
        res.PY$__name__  = str(name);
    } else {
        res.PY$__name__  = name;
    }
    res.PY$__super__ = cls;
    return res;
};

var object = __inherit(null, "object");

object.PY$__init__ = function() {
};

object.PY$__create__ = function(cls) {
    var args = Array.prototype.slice.call(arguments, 1);

    var obj = function() {
        var x = cls.PY$__call__;
        if (typeof x != 'undefined') {
            return cls.PY$__call__.apply(cls, args);
        } else {
            throw py_builtins.AttributeError("Object " + name + " does not have __call__ method");
        }
    };

    if (typeof cls != 'undefined') {
        for (var o in cls) {
            obj[o] = cls[o];
        }
    }

    obj.PY$__class__ = cls;
    obj.PY$__init__.apply(obj, args);
    return obj;
};

object.PY$__setattr__ = function(k, v) {
    this["PY$" + k] = v;
};

object.PY$__getattr__ = function(k) {
    var q = this["PY$" + k];
    if ((typeof q == 'function') && (typeof q.PY$__class__ == 'undefined') && (k !== '__class__') && arguments[1] !== false) {
        var that = this;
        var t = function() { return q.apply(that, arguments); };
        t.PY$__call__ = t;
        return t;
    } else {
        return q;
    }
};

object.PY$__delattr__ = function(k) {
    delete this["PY$" + k];
};

object.PY$__repr__ = function() {
    if (this.PY$__class__) {
        return str("<instance of " + this.PY$__class__.PY$__name__ + " at 0xPYJACO>");
    } else {
        return str("<" + this.PY$__name__ + " class at 0xPYJACO>");
    }
};

object.PY$__eq__ = function(other) {
    return bool(this === other);
};

object.PY$__str__ = object.PY$__repr__;

object.PY$__ne__ = function (other) {
    return py_builtins.__not__(this.PY$__eq__(other));
};

object.PY$__cmp__ = function (y) {
    var g = this.PY$__gt__(y);
    if (g == true) {
        return $c1;
    } else {
        return int(-js(this.PY$__lt__(y)));
    }
};

object.toString = function () {
    return js(this.PY$__str__());
};

object.valueOf = function () {
    return js(this);
};