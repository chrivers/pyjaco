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

    if (name === undefined) {
        throw py_builtins.TypeError("The function __inherit must get exactly 2 arguments");
    }

    var res = function() {
        var x = res.PY$__create__;
        if (x !== undefined) {
            return res.PY$__create__.apply(null, [res].concat(Array.prototype.slice.call(arguments)));
        } else {
            throw py_builtins.AttributeError("Class " + name + " does not have __create__ method");
        }
    };

    if (cls !== undefined) {
        for (var o in cls) {
            res[o] = cls[o];
        }
    }

    res.PY$__name__  = name;
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
        if (x !== undefined) {
            return cls.PY$__call__.apply(cls, args);
        } else {
            throw py_builtins.AttributeError("Object " + name + " does not have __call__ method");
        }
    };

    if (obj.__proto__ === undefined) {
        for (var o in cls) {
            obj[o] = cls[o];
        }
    } else {
        obj.__proto__ = cls;
    };

    obj.PY$__class__ = cls;
    obj.PY$__init__.apply(obj, args);
    return obj;
};

object.PY$__setattr__ = function(k, v) {
    this["PY$" + k] = v;
};

object.PY$__getattr__ = function(k) {
    var q = this["PY$" + k];
    if ((typeof q == 'function') && (q.PY$__class__ === undefined) && (k !== '__class__') && arguments[1] !== false) {
        var that = this;
        if (this.PY$__class__ == undefined && !q.__static) {
            var t = function() { return q.apply(arguments[0], Array.prototype.slice.call(arguments, 1)); };
        } else {
            var t = function() { return q.apply(that, arguments); };
        }
        return t;
    } else if (k === '__name__') {
        return str(this.PY$__name__);
    } else {
        if (q === undefined) {
            throw py_builtins.AttributeError(this.PY$__repr__() + " does not have attribute '" + k + "'");
        } else {
            return q;
        }
    }
};

object.PY$__delattr__ = function(k) {
    delete this["PY$" + k];
};

object.PY$__repr__ = function() {
    if (this.PY$__class__) {
        return str("<instance of " + this.PY$__class__.PY$__name__ + " at 0xPYJACO>");
    } else {
        return str("<type '" + this.PY$__name__ + "'>");
    }
};

object.PY$__str__ = object.PY$__repr__;

object.PY$__eq__ = function(other) {
    return this === other ? True : False;
};

object.PY$__ne__ = function (other) {
    return py_builtins.__not__(this.PY$__eq__(other));
};

object.PY$__gt__ = function(other) {
    return this.PY$__class__.PY$__name__ > other.PY$__class__.PY$__name__ ? True : False;
};

object.PY$__lt__ = function(other) {
    if (other === this) {
        return False;
    } else {
        return this.PY$__class__.PY$__name__ < other.PY$__class__.PY$__name__ ? True : False;
    }
};

object.PY$__ge__ = function(other) {
    return this.PY$__lt__(other) == false ? True : False;
};

object.PY$__le__ = function(other) {
    return this.PY$__gt__(other) == false ? True : False;
};

object.PY$__cmp__ = function (y) {
    if (this.PY$__gt__(y) == true) {
        return $c1;
    } else {
        if (this.PY$__lt__(y) == true) {
            return $cn1;
        } else {
            return $c0;
        }
    }
};

object.toString = function () {
    return js(this.PY$__str__());
};

object.valueOf = function () {
    return js(this);
};
