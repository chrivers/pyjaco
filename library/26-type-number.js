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

var __py2js_number = number;

number.PY$_isnumeric_ = true;

number.PY$__repr__ = number.PY$__str__;

number.PY$__eq__ = function (other) {
    if (typeof(other) === "number") {
        return bool(this._obj === other);
    }
    if (other.PY$__class__ !== this.PY$__class__)
        return False;
    return bool(this._obj === other._obj);
};

number.toString = function () {
    return js(this.PY$__str__());
};

number._js_ = function () {
    return this._obj;
};

number.PY$__bool__ = function() {
    return py_builtins.bool(this._obj);
};

number.PY$__pos__ = function() {
    return this.PY$__class__(+this._obj);
};

number.PY$__neg__ = function() {
    return this.PY$__class__(-this._obj);
};

number.PY$__nonzero__ = function() {
    return py_builtins.bool(this._obj != 0);
};

number.PY$__gt__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot compare number and non-number");
    return py_builtins.bool(this._obj > x._obj);
};

number.PY$__lt__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot compare number and non-number");
    return py_builtins.bool(this._obj < x._obj);
};

number.PY$__ge__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot compare number and non-number");
    return py_builtins.bool(this._obj >= x._obj);
};

number.PY$__le__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot compare number and non-number");
    return py_builtins.bool(this._obj <= x._obj);
};

number.PY$__mul__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot multiply number and non-number");
    if (this.PY$_isnumeric_float || (! x.PY$_isnumeric_float))
        return this.PY$__class__(this._obj * x._obj);
    else
        return x.PY$__class__(this._obj * x._obj);
};

number.PY$__add__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot add number and non-number");
    if (this.PY$_isnumeric_float || (! x.PY$_isnumeric_float))
        return this.PY$__class__(this._obj + x._obj);
    else
        return x.PY$__class__(this._obj + x._obj);
};

number.PY$__div__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot divide number and non-number");
    if (this.PY$_isnumeric_float || (! x.PY$_isnumeric_float))
        return this.PY$__class__(this._obj / x._obj);
    else
        return x.PY$__class__(this._obj / x._obj);
};

number.PY$__sub__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot subtract number and non-number");
    if (this.PY$_isnumeric_float || (! x.PY$_isnumeric_float))
        return this.PY$__class__(this._obj - x._obj);
    else
        return x.PY$__class__(this._obj - x._obj);
};

number.PY$__pow__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot exponentiate number and non-number");
    if (this.PY$_isnumeric_float || (! x.PY$_isnumeric_float))
        return this.PY$__class__(Math.pow(this._obj, x._obj));
    else
        return x.PY$__class__(Math.pow(this._obj, x._obj));
};

number.PY$__and__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on number and non-number");
    if (this._obj === 0) {
        return this;
    } else {
        return x;
    }
};

number.PY$__or__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on number and non-number");
    if (this._obj === 0) {
        return x;
    } else {
        return this;
    }
};

number.PY$__imul__      = number.PY$__mul__;
number.PY$__iadd__      = number.PY$__add__;
number.PY$__idiv__      = number.PY$__div__;
number.PY$__isub__      = number.PY$__sub__;
number.PY$__ipow__      = number.PY$__pow__;
number.PY$__iand__      = number.PY$__and__;
number.PY$__ior__       = number.PY$__or__;
