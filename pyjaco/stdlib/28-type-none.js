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

var none = __inherit(object, "NoneType");

none.PY$__init__ = function(self) {
    self.obj = null;
};

none.PY$__str__ = function() {
    return str("None");
};

none.PY$__repr__ = none.PY$__str__;

none.PY$__eq__ = function(self, other) {
    if (other.PY$__class__ !== self.PY$__class__) {
        return False;
    } else if (other === null) {
        return True;
    } else {
        return this.obj === other.obj ? True : False;
    }
};

none._js_ = function () {
    return this.obj;
};

none.PY$__nonzero__ = function(self) {
    return False;
};

var None = none();
__builtins__.PY$None = None;

none.PY$__create__ = function(self) {
    return None;
};
