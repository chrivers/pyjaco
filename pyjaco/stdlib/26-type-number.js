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

var number = __inherit(object, "number");

__builtins__.number = number;

number.PY$__repr__ = number.PY$__str__;

number.PY$__eq__ = function (other) {
    if (typeof(other) === "number") {
        return this.obj === other ? True : False;
    } else if (other.numbertype) {
        return this.obj === other.obj ? True : False;
    } else if (other[this.numbertype] !== undefined) {
        return this.obj === other[this.numbertype]()._js_() ? True : False;
    } else {
        return object.PY$__eq__.call(this, other);
    }
};

number.toString = function () {
    return js(this.PY$__str__());
};

number._js_ = function () {
    return this.obj;
};

number.PY$__pos__ = function() {
    return this.PY$__class__(+this.obj);
};

number.PY$__abs__ = function() {
    return this.PY$__class__(Math.abs(this.obj));
};

number.PY$__neg__ = function() {
    return this.PY$__class__(-this.obj);
};

number.PY$__nonzero__ = function() {
    return this.obj != 0 ? True : False;
};

number.PY$__gt__ = function(x) {
    if (this.PY$__class__ === undefined) {
        return object.PY$__gt__.call(this, x);
    } else if (x.numbertype) {
        return this.obj > x.obj ? True : False;
    } else if (x[this.numbertype] !== undefined) {
        return this.obj > x[this.numbertype]()._js_() ? True : False;
    } else {
        return object.PY$__gt__.call(this, x);
    }
};

number.PY$__lt__ = function(x) {
    if (this.PY$__class__ === undefined) {
        return object.PY$__lt__.call(this, x);
    } else if (x.numbertype) {
        return this.obj < x.obj ? True : False;
    } else if (x[this.numbertype] !== undefined) {
        return this.obj < x[this.numbertype]()._js_() ? True : False;
    } else {
        return object.PY$__lt__.call(this, x);
    }
};

number.PY$__mul__ = function(x) {
    if (x.numbertype === undefined) {
        if (x.PY$__int__ !== undefined) {
            return this.numberclass(this.obj * x.PY$__int__()._js_());
        } else if ($PY.isinstance(x, [basestring, list, tuple])) {
            return x.PY$__mul__(this);
        } else {
            throw __builtins__.PY$TypeError("Cannot multiply number and non-number");
        }
    } else if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__')) {
        return this.numberclass(this.obj * x.obj);
    } else {
        return x.numberclass(this.obj * x.obj);
    }
};

number.PY$__add__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot add number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this.obj + x.obj);
    else
        return x.numberclass(this.obj + x.obj);
};

number.PY$__div__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot divide number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this.obj / x.obj);
    else
        return x.numberclass(this.obj / x.obj);
};

number.PY$__sub__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot subtract number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(this.obj - x.obj);
    else
        return x.numberclass(this.obj - x.obj);
};

number.PY$__pow__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot exponentiate number and non-number");
    if ((this.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return this.numberclass(Math.pow(this.obj, x.obj));
    else
        return x.numberclass(Math.pow(this.obj, x.obj));
};

number.PY$__imul__      = number.PY$__mul__;
number.PY$__iadd__      = number.PY$__add__;
number.PY$__idiv__      = number.PY$__div__;
number.PY$__isub__      = number.PY$__sub__;
number.PY$__ipow__      = number.PY$__pow__;
