/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
  Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
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

var iter = __inherit(object, "iter");

iter.prototype.__init__ = function(obj) {
    this._index = 0;
    if (!defined(obj)) {
        throw py_builtins.TypeError.__call__("iter() expects at least 1 argument");
    } else if (obj instanceof Array) {
        this._seq = obj;
    } else if (typeof(obj) === "string") {
        this._seq = obj.split("");
        for (var i = 0; i < this._seq.length; i++) {
            this._seq[i] = str.__call__(this._seq[i]);
        }
    } else if (obj.__class__ == iter) {
        this._seq = obj._seq;
    } else {
        throw py_builtins.TypeError.__call__("object is not iterable");
    }
};

var __iter_real__ = iter.__call__;

iter.__call__ = function(obj) {
    if (defined(obj.__iter__)) {
        return obj.__iter__();
    } else {
        return __iter_real__(obj);
    }
};

iter.prototype.__str__ = function () {
    return str.__call__("<iterator of " + this._seq + " at " + this._index + ">");
};

iter.prototype.next = Function(function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw py_builtins.StopIteration.__call__('no more items');
    }
});
