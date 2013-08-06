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

var number = __inherit(object, "number");

__builtins__.number = number;

number.PY$__repr__ = number.PY$__str__;

number.PY$__eq__ = function(self, other) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__eq__(self, other);
    } else if (typeof(other) === "number") {
        return self.obj === other ? True : False;
    } else if (other.numbertype) {
        return self.obj === other.obj ? True : False;
    } else if (other[self.numbertype] !== undefined) {
        return self.obj === other[self.numbertype](other)._js_() ? True : False;
    } else {
        return object.PY$__eq__(self, other);
    }
};

number.toString = function() {
    return js(this.PY$__str__(this));
};

number._js_ = function() {
    return this.obj;
};

number.PY$__pos__ = function(self) {
    return self.PY$__class__(+self.obj);
};

number.PY$__abs__ = function(self) {
    return self.PY$__class__(Math.abs(self.obj));
};

number.PY$__neg__ = function(self) {
    return self.PY$__class__(-self.obj);
};

number.PY$__nonzero__ = function(self) {
    return self.obj != 0 ? True : False;
};

number.PY$__gt__ = function(self, x) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__gt__(self, x);
    } else if (x.numbertype) {
        return self.obj > x.obj ? True : False;
    } else if (x[self.numbertype] !== undefined) {
        return self.obj > x[self.numbertype](x)._js_() ? True : False;
    } else {
        return object.PY$__gt__(self, x);
    }
};

number.PY$__lt__ = function(self, x) {
    if (self.PY$__class__ === undefined) {
        return object.PY$__lt__(self, x);
    } else if (x.numbertype) {
        return self.obj < x.obj ? True : False;
    } else if (x[self.numbertype] !== undefined) {
        return self.obj < x[self.numbertype](x)._js_() ? True : False;
    } else {
        return object.PY$__lt__(self, x);
    }
};

number.PY$__mul__ = function(self, x) {
    if (x.numbertype === undefined) {
        if (x.PY$__int__ !== undefined) {
            return self.numberclass(self.obj * x.PY$__int__(x)._js_());
        } else if ($PY.isinstance(x, [basestring, list, tuple])) {
            return x.PY$__mul__(self);
        } else {
            throw __builtins__.PY$TypeError("Cannot multiply number and non-number");
        }
    } else if ((self.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__')) {
        return self.numberclass(self.obj * x.obj);
    } else {
        return x.numberclass(self.obj * x.obj);
    }
};

number.PY$__add__ = function(self, x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot add number and non-number");
    if ((self.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return self.numberclass(self.obj + x.obj);
    else
        return x.numberclass(self.obj + x.obj);
};

number.PY$__div__ = function(self, x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot divide number and non-number");
    if ((self.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return self.numberclass(self.obj / x.obj);
    else
        return x.numberclass(self.obj / x.obj);
};

number.PY$__sub__ = function(self, x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot subtract number and non-number");
    if ((self.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return self.numberclass(self.obj - x.obj);
    else
        return x.numberclass(self.obj - x.obj);
};

number.PY$__pow__ = function(self, x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot exponentiate number and non-number");
    if ((self.numbertype === 'PY$__float__') || (x.numbertype !== 'PY$__float__'))
        return self.numberclass(Math.pow(self.obj, x.obj));
    else
        return x.numberclass(Math.pow(self.obj, x.obj));
};

number.PY$__imul__      = number.PY$__mul__;
number.PY$__iadd__      = number.PY$__add__;
number.PY$__idiv__      = number.PY$__div__;
number.PY$__isub__      = number.PY$__sub__;
number.PY$__ipow__      = number.PY$__pow__;
