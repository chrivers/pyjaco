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

var number = __inherit(object, "int");

$PY.number = number;

number.PY$__repr__ = number.PY$__str__;

number.PY$__eq__ = function (other) {
    if (typeof(other) === "number") {
        return bool(this._obj === other);
    } else if (other.numbertype) {
        return bool(this._obj === other._obj);
    } else if (other[this.numbertype] !== undefined) {
        return bool(this._obj === other[this.numbertype]()._js_());
    } else {
        return object.PY$__eq__.call(this, other);
    }
};

number.toString = function () {
    return js(this.PY$__str__());
};

number._js_ = function () {
    return this._obj;
};

number.PY$__bool__ = function() {
    return bool(this._obj);
};

number.PY$__pos__ = function() {
    return this.PY$__class__(+this._obj);
};

number.PY$__neg__ = function() {
    return this.PY$__class__(-this._obj);
};

number.PY$__nonzero__ = function() {
    return bool(this._obj != 0);
};

number.PY$__gt__ = function(x) {
    if (x.numbertype) {
        return bool(this._obj > x._obj);
    } else if (x[this.numbertype] !== undefined) {
        return bool(this._obj > x[this.numbertype]()._js_());
    } else {
        return object.PY$__gt__.call(this, x);
    }
};

number.PY$__lt__ = function(x) {
    if (x.numbertype) {
        return bool(this._obj < x._obj);
    } else if (x[this.numbertype] !== undefined) {
        return bool(this._obj < x[this.numbertype]()._js_());
    } else {
        return object.PY$__lt__.call(this, x);
    }
};

number.PY$__mul__ = function(x) {
    if (x.numbertype === undefined) {
        if (x.PY$__int__ !== undefined) {
            return this.numberclass(this._obj * x.PY$__int__()._js_());
        } else if (py_builtins.isinstance(x, basestring)) {
            return x.PY$__mul__(this);
        } else {
            throw py_builtins.TypeError("Cannot multiply number and non-number");
        }
    } else if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__')) {
        return this.numberclass(this._obj * x._obj);
    } else {
        return x.numberclass(this._obj * x._obj);
    }
};

number.PY$__add__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot add number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this._obj + x._obj);
    else
        return x.numberclass(this._obj + x._obj);
};

number.PY$__div__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot divide number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this._obj / x._obj);
    else
        return x.numberclass(this._obj / x._obj);
};

number.PY$__sub__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot subtract number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this._obj - x._obj);
    else
        return x.numberclass(this._obj - x._obj);
};

number.PY$__pow__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot exponentiate number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(Math.pow(this._obj, x._obj));
    else
        return x.numberclass(Math.pow(this._obj, x._obj));
};

number.PY$__imul__      = number.PY$__mul__;
number.PY$__iadd__      = number.PY$__add__;
number.PY$__idiv__      = number.PY$__div__;
number.PY$__isub__      = number.PY$__sub__;
number.PY$__ipow__      = number.PY$__pow__;
