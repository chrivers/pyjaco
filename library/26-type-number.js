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

number.prototype._isnumeric_ = true;

number.prototype.__repr__ = number.prototype.__str__;

number.prototype.__eq__ = function (other) {
    if (typeof(other) === "number") {
        return bool.__call__(this._obj === other);
    }
    if (other.__class__ !== this.__class__)
        return False;
    return bool.__call__(this._obj === other._obj);
};

number.prototype.toString = function () {
    return js(this.__str__());
};

number.prototype._js_ = function () {
    return this._obj;
};

number.prototype.__bool__ = function() {
    return py_builtins.bool(this._obj);
};

number.prototype.__pos__ = function() {
    return this.__class__.__call__(+this._obj);
};

number.prototype.__neg__ = function() {
    return this.__class__.__call__(-this._obj);
};

number.prototype.__nonzero__ = function() {
    return py_builtins.bool(this._obj != 0);
};

number.prototype.__gt__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot compare number and non-number");
    return py_builtins.bool(this._obj > x._obj);
};

number.prototype.__lt__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot compare number and non-number");
    return py_builtins.bool(this._obj < x._obj);
};

number.prototype.__ge__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot compare number and non-number");
    return py_builtins.bool(this._obj >= x._obj);
};

number.prototype.__le__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot compare number and non-number");
    return py_builtins.bool(this._obj <= x._obj);
};

number.prototype.__mul__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot multiply number and non-number");
    if (this._isnumeric_float || (! x._isnumeric_float))
        return this.__class__.__call__(this._obj * x._obj);
    else
        return x.__class__.__call__(this._obj * x._obj);
};

number.prototype.__add__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot add number and non-number");
    if (this._isnumeric_float || (! x._isnumeric_float))
        return this.__class__.__call__(this._obj + x._obj);
    else
        return x.__class__.__call__(this._obj + x._obj);
};

number.prototype.__div__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot divide number and non-number");
    if (this._isnumeric_float || (! x._isnumeric_float))
        return this.__class__.__call__(this._obj / x._obj);
    else
        return x.__class__.__call__(this._obj / x._obj);
};

number.prototype.__sub__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot subtract number and non-number");
    if (this._isnumeric_float || (! x._isnumeric_float))
        return this.__class__.__call__(this._obj - x._obj);
    else
        return x.__class__.__call__(this._obj - x._obj);
};

number.prototype.__pow__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot exponentiate number and non-number");
    if (this._isnumeric_float || (! x._isnumeric_float))
        return this.__class__.__call__(Math.pow(this._obj, x._obj));
    else
        return x.__class__.__call__(Math.pow(this._obj, x._obj));
};

number.prototype.__and__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot operate on number and non-number");
    if (this._obj === 0) {
        return this;
    } else {
        return x;
    }
};

number.prototype.__or__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot operate on number and non-number");
    if (this._obj === 0) {
        return x;
    } else {
        return this;
    }
};

number.prototype.__imul__      = number.prototype.__mul__;
number.prototype.__iadd__      = number.prototype.__add__;
number.prototype.__idiv__      = number.prototype.__div__;
number.prototype.__isub__      = number.prototype.__sub__;
number.prototype.__ipow__      = number.prototype.__pow__;
number.prototype.__iand__      = number.prototype.__and__;
number.prototype.__ior__       = number.prototype.__or__;
