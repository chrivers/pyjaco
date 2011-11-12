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

var _int = __inherit(number, "int");

$PY.int = _int;

_int.PY$__init__ = function(i) {
    if (arguments.length == 2) {
        this._obj = parseInt(i, arguments[1]);
    } else {
        this._obj = parseInt(i, 10);
    }
};

var ___int_real__ = _int.PY$__create__;

_int.PY$__create__ = function(obj) {
    if (js(isinstance(obj, object))) {
        return obj.PY$__int__();
    } else {
        return ___int_real__(obj);
    }
};

_int.PY$_isnumeric_float = false;

_int.PY$__int__ = function () {
    return this;
};

_int.PY$__str__ = function () {
    return str(this._obj);
};

_int.PY$__repr__ = _int.PY$__str__;

_int.PY$__hash__ = function () {
    return this._obj;
};

_int.PY$__invert__ = function() {
    return _int(~this._obj);
};

_int.PY$__div__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot divide int and non-int");
    if (x._obj === 0)
        throw py_builtins.ZeroDivisionError("integer division or modulo by zero");
    return _float(this._obj / x._obj);
};

_int.PY$__floordiv__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    if (x._obj === 0)
        throw py_builtins.ZeroDivisionError("integer division or modulo by zero");
    return _int(Math.floor(this._obj / x._obj));
};

_int.PY$__mod__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot find remainder of int and non-int");
    return _int(this._obj % x._obj);
};

_int.PY$__pow__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot exponentiate int and non-int");
    return _int(Math.pow(this._obj, x._obj));
};

_int.PY$__bitand__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    return _int(this._obj & x._obj);
};

_int.PY$__bitor__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    return _int(this._obj | x._obj);
};

_int.PY$__bitxor__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    return _int(this._obj ^ x._obj);
};

_int.PY$__lshift__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    return _int(this._obj << x._obj);
};

_int.PY$__rshift__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot operate on int and non-int");
    return _int(this._obj >> x._obj);
};

_int.PY$__div__ = function(x) {
    if (!x.PY$_isnumeric_)
        throw py_builtins.TypeError("Cannot exponentiate number and number-int");
    return _float(this._obj / x._obj);
};

_int.PY$__idiv__      = _int.PY$__div__;
_int.PY$__ilshift__   = _int.PY$__lshift__;
_int.PY$__irshift__   = _int.PY$__rshift__;
_int.PY$__ibitand__   = _int.PY$__bitand__;
_int.PY$__ibitor__    = _int.PY$__bitor__;
_int.PY$__ibitxor__   = _int.PY$__bitxor__;
_int.PY$__ifloordiv__ = _int.PY$__floordiv__;

var $c0 = _int(0);
var $c1 = _int(1);
var $c2 = _int(2);
var $c3 = _int(3);
var $c4 = _int(4);
var $c5 = _int(5);
var $c6 = _int(6);
var $c7 = _int(7);
var $c8 = _int(8);
var $c9 = _int(9);
