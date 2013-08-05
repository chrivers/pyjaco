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

var iter = __inherit(object, "iter");

__builtins__.PY$iter = iter;

iter.PY$__init__ = function(self, obj) {
    self.index = 0;
    if (obj === undefined) {
        throw __builtins__.PY$TypeError("iter() expects at least 1 argument");
    } else if (obj instanceof Array) {
        self.seq = obj;
    } else if (typeof obj === "string") {
        self.seq = obj.split("");
        for (var i = 0; i < self.seq.length; i++) {
            self.seq[i] = str(self.seq[i]);
        }
    } else {
        throw __builtins__.PY$TypeError("object is not iterable");
    }
};

var __iter_real__ = iter.PY$__create__;

iter.PY$__create__ = function(cls, obj) {
    if (obj.PY$__class__ === iter) {
       return obj;
    } else if (obj.PY$__iter__ !== undefined) {
        return obj.PY$__iter__();
    } else {
        return __iter_real__(cls, obj);
    }
};

iter.PY$__str__ = function(self) {
    return str("<iterator of " + self.seq + " at " + self.index + ">");
};

iter.PY$next = function(self) {
    var value = self.seq[self.index++];

    if (self.index <= self.seq.length) {
        if (value === undefined) {
            return None;
        } else {
            return value;
        }
    } else {
        throw $PY.c_stopiter;
    }
};

iter.next = function(self) {
    if (self.index >= self.seq.length) {
        return null;
    } else {
        return self.seq[self.index++];
    }
};
