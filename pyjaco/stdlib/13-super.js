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

__builtins__.PY$super = __inherit(object, "super");

var $super = __builtins__.PY$super;

$super.PY$__init__ = function(cls, obj) {
    this.cls = cls;
    this.obj = obj;
};

$super.PY$__getattribute__ = function(k) {
    var q = $PY.getattr(this.cls.PY$__super__, k);
    if ((typeof q === 'function') && q.PY$__class__ === undefined) {
        var that = this.obj;
        var t = function() { return q.apply(null, [that].concat(Array.prototype.slice.call(arguments))); };
        t.PY$__call__ = t;
        return t;
    } else {
        return q;
    }
};

$super.PY$__repr__ = function() {
    return str("<super " + this.cls.toString() + ", " + this.obj.toString() + ">");
};

$super.PY$__str__ = $super.PY$__repr__;
