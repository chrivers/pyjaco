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

var int = __inherit(number, "int");

__builtins__.PY$int = int;

int.numbertype = "PY$__int__";
int.numberclass = int;

int.PY$__init__ = function(value) {
    if (arguments.length === 2) {
        this.obj = parseInt(i, arguments[1]);
    } else {
        var s = js(str(value));
        if (s.match(/^[-+0-9]+$/)) {
            this.obj = parseInt(s, 10);
        } else {
            throw __builtins__.PY$ValueError("Invalid integer: " + value);
        }
    }
};

var __int_real__ = int.PY$__create__;

int.PY$__create__ = function(cls, obj) {
    if (js($PY.isinstance(obj, object)) && (obj.PY$__int__ !== undefined)) {
        return obj.PY$__int__();
    } else {
        return __int_real__(cls, obj);
    }
};

int.PY$__int__ = function () {
    return this;
};

int.PY$__float__ = function () {
    return float(this.obj);
};

int.PY$__str__ = function () {
    return str(this.obj);
};

int.PY$__repr__ = int.PY$__str__;

int.PY$__hash__ = function () {
    return this.obj;
};

int.PY$__invert__ = function() {
    return int(~this.obj);
};

int.PY$__div__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot divide int and non-int");
    if (x.obj === 0)
        throw __builtins__.PY$ZeroDivisionError("integer division or modulo by zero");
    var res = this.obj / x.obj;
    return float(res);
};

int.PY$__floordiv__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    if (x.obj === 0)
        throw __builtins__.PY$ZeroDivisionError("integer division or modulo by zero");
    if (x.numbertype === "PY$__float__") {
        return float(this.obj / x.obj);
    } else {
        return int(Math.floor(this.obj / x.obj));
    }
};

int.PY$__mod__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot find remainder of int and non-int");
    return int(this.obj % x.obj);
};

int.PY$__pow__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot exponentiate int and non-int");
    if (x.numbertype === "PY$__float__") {
        return float(Math.pow(this.obj, x.obj));
    } else {
        return int(Math.floor(Math.pow(this.obj, x.obj)));
    }
};

int.PY$__bitand__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    return int(this.obj & x.obj);
};

int.PY$__bitor__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    return int(this.obj | x.obj);
};

int.PY$__bitxor__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    return int(this.obj ^ x.obj);
};

int.PY$__lshift__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    return int(this.obj << x.obj);
};

int.PY$__rshift__ = function(x) {
    if (!x.numbertype)
        throw __builtins__.PY$TypeError("Cannot operate on int and non-int");
    return int(this.obj >> x.obj);
};

int.PY$__idiv__      = int.PY$__div__;
int.PY$__ilshift__   = int.PY$__lshift__;
int.PY$__irshift__   = int.PY$__rshift__;
int.PY$__ibitand__   = int.PY$__bitand__;
int.PY$__ibitor__    = int.PY$__bitor__;
int.PY$__ibitxor__   = int.PY$__bitxor__;
int.PY$__ifloordiv__ = int.PY$__floordiv__;

var $cn1 = int(-1);
var $c0 = int(0);
var $c1 = int(1);
var $c2 = int(2);
var $c3 = int(3);
var $c4 = int(4);
var $c5 = int(5);
var $c6 = int(6);
var $c7 = int(7);
var $c8 = int(8);
var $c9 = int(9);
