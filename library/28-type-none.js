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

none.prototype.__init__ = function(b) {
    this._obj = null;
};

var __py2jsnone = none;

none.prototype.__str__ = function () {
    return str.__call__("None");       
};

none.prototype.toString = function () {
    return "";
};

none.prototype.__repr__ = none.prototype.__str__;

none.prototype.__eq__ = function (other) {
    if (other.__class__ !== this.__class__) {
        return False;
    } else if (other === null) {
        return True;
    } else {
        return bool.__call__(this._obj === other._obj);
    }
};

none.prototype._js_ = function () {
    return this._obj;
};

none.prototype.__nonzero__ = function() {
    return False;
};

none.prototype.__and__ = function(x) {
    return None;
};

none.prototype.__or__ = function(x) {
    return x;
};

var None = none.__call__();

none.__call__ = function() {
    return None;
};
