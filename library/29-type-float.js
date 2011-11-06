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

var _float = __inherit(number, "float");

var __py2js_float = _float;

_float.prototype.__init__ = function(i) {
    this._obj = parseFloat(i);
};

_float.prototype._isnumeric_float = true;

_float.prototype.__float__ = function () {
    return this;
};

_float.prototype.__int__ = function () {
    return _int.__call__(parseInt(this._obj));
};

_float.prototype.__str__ = function () {
    if (this._obj.toString().indexOf(".") === -1) {
        return str.__call__(this._obj + ".0");
    } else {
        return str.__call__(this._obj);
    }
};

_float.prototype.__repr__ = _float.prototype.__str__;

_float.prototype.__hash__ = function () {
    return this._obj;
};

_float.prototype.__div__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot divide number and non-number");
    if (x._obj === 0)
        throw py_builtins.ZeroDivisionError.__call__("float division by zero");
    return _float.__call__((0.0 + this._obj) / (0.0 + x._obj));
};

_float.prototype.__pow__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot exponentiate number and non-number");
    return _float.__call__(Math.pow(this._obj, x._obj));
};

_float.prototype.__floordiv__ = _float.prototype.__div__;
_float.prototype.__ifloordiv__ = _float.prototype.__div__;
