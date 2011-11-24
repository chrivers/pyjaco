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

var bool = __inherit(int, "bool");

$PY.bool = bool;

bool.PY$__init__ = function(b) {
    if (b) {
        this._obj = 1;
    } else {
        this._obj = 0;
    }
};

bool.PY$__bool__ = function () {
    return this._obj;
};

bool.PY$__str__ = function () {
    if (this._obj) {
        return str("True");
    } else {
        return str("False");
    }
};

bool.toString = function () {
    if (this._obj) {
        return "1";
    } else {
        return "";
    }
};

bool.PY$__repr__ = bool.PY$__str__;

bool.PY$__eq__ = function (other) {
    if (other.PY$__int__ !== undefined)
        return bool(Number(this._obj) == other.PY$__int__()._js_());

    return bool(this._obj === other._obj);
};

bool._js_ = function () {
    if (this._obj) {
        return true;
    } else {
        return false;
    }
};

bool.PY$__neg__ = function() {
    return bool(!this._obj);
};

bool.PY$__nonzero__ = function() {
    return bool(this._obj);
};

bool.PY$__int__ = function() {
    if (this._obj) {
        return $c1;
    } else {
        return $c0;
    }
};

var True = bool(true);
var False = bool(false);

bool.PY$__create__ = function(cls, b) {
    if ((b !== null) && (b.PY$__bool__ != undefined)) {
        return b.PY$__bool__();
    } else if (b) {
        return True;
    } else {
        return False;
    }
};
