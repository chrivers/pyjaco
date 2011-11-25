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

var float = __inherit(number, "float");

$PY.float = float;

float.numbertype = "PY$__float__";
float.numberclass = float;

float.PY$__init__ = function(value) {
    var s = value.toString();
    if (s.match(/^[-+]?[0-9]+(\.[0-9]*)?(e[-+]?[0-9]+)?$/)) {
        this.obj = parseFloat(value);
    } else {
        throw py_builtins.ValueError("Invalid float: " + s);
    }
};

var __float_real__ = float.PY$__create__;

float.PY$__create__ = function(cls, obj) {
    if (js($PY.isinstance(obj, object)) && (obj.PY$__float__ !== undefined)) {
        return obj.PY$__float__();
    } else {
        return __float_real__(cls, obj);
    }
};

float.PY$__float__ = function () {
    return this;
};

float.PY$__int__ = function () {
    return int(parseInt(this.obj));
};

float.PY$__str__ = function () {
    if (this.obj - Math.floor(this.obj) < 1e-6) {
        var res = sprintf("%g", this);
        if (res.indexOf('e') === -1) {
            return str(res + ".0");
        } else {
            return str(res);
        }
    } else {
        return str(sprintf("%.10g", this));
    }
};

float.PY$__repr__ = float.PY$__str__;

float.PY$__hash__ = function () {
    return this.obj;
};

float.PY$__div__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot divide number and non-number");
    if (x.obj === 0)
        throw py_builtins.ZeroDivisionError("float division by zero");
    return float((0.0 + this.obj) / (0.0 + x.obj));
};

float.PY$__pow__ = function(x) {
    if (!x.numbertype)
        throw py_builtins.TypeError("Cannot exponentiate number and non-number");
    return float(Math.pow(this.obj, x.obj));
};

float.PY$__floordiv__ = float.PY$__div__;
float.PY$__ifloordiv__ = float.PY$__div__;
