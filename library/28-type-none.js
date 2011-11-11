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

var none = __inherit(object, "none");

none.PY$__init__ = function(b) {
    this._obj = null;
};

var __py2jsnone = none;

none.PY$__str__ = function () {
    return str("None");
};

none.toString = function () {
    return "";
};

none.PY$__repr__ = none.PY$__str__;

none.PY$__eq__ = function (other) {
    if (other.PY$__class__ !== this.PY$__class__) {
        return False;
    } else if (other === null) {
        return True;
    } else {
        return bool(this._obj === other._obj);
    }
};

none._js_ = function () {
    return this._obj;
};

none.PY$__nonzero__ = function() {
    return False;
};

none.PY$__and__ = function(x) {
    return None;
};

none.PY$__or__ = function(x) {
    return x;
};

var None = none();

none.PY$__create__ = function() {
    return None;
};
