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

$PY.isinstance = function(obj, cls) {
    if (cls instanceof Array) {
        for (var i = 0; i < cls.length; i++) {
            var c = obj.PY$__class__;
            while (c) {
                if (c === cls[i])
                    return true;
                c = c.PY$__super__;
            }
        }

        return false;
    } else {
        var c = obj.PY$__class__;
        while (c) {
            if (c === cls)
                return true;
            c = c.PY$__super__;
        }
        return false;
    }
};

$PY.repr = function(obj) {
    return __builtins__.PY$repr(obj)._js_();
};

$PY.dump = function(obj) {
    var res = [];
    if (obj === undefined) {
        return "<undefined>";
    } else if (obj !== undefined && obj.PY$__class__ !== undefined) {
        return "<pyjaco object of class " + obj.PY$__class__.PY$__name__ + ": " + $PY.repr(obj) + ">";
    };
    if (typeof obj === 'object') {
        for (var i in obj) {
            var val = obj[i];
            if (typeof val === 'function') {
                res.push(i + " (function)");
            } else if (typeof val === 'number') {
                res.push(i + " (number: " + val + ")");
            } else if (typeof val === 'string') {
                res.push(i + " (string: " + val + ")");
            } else if (val === null) {
                res.push(i + " (null)");
            } else if (val === undefined) {
                res.push(i + " (undefined)");
            } else {
                res.push(i + " (object)");
            }
        }
        res.sort();
    } else {
        var val = obj;
        if (typeof val === 'function') {
            return "<function>";
        } else if (typeof val === 'number') {
            return "<number: " + val + ">";
        } else if (typeof val === 'string') {
            return "<string: " + val + ">";
        } else if (val === null) {
            return "<null>";
        } else if (val === undefined) {
            return "<undefined>";
        } else {
            return "<object>";
        }
    }
    return "<" + (typeof obj) + " with " + res.length + " properties> {" + res.join(", ") + "}";
};

$PY.len = function(obj) {
    var c = obj.PY$__class__;
    if (c === list || c === tuple || c === str || c === basestring || c === unicode) {
        return obj.obj.length;
    } else if (obj.PY$__len__ !== undefined) {
        return obj.PY$__len__()._js_();
    } else {
        throw __builtins__.PY$AttributeError('__len__');
    }
};

$PY.next = function(obj) {
    if (obj.PY$__class__ === iter) {
        return obj.next();
    } else {
        try {
            return obj.PY$next();
        } catch (x) {
            if (x === $PY.c_stopiter || $PY.isinstance(x, __builtins__.PY$StopIteration)) {
                return null;
            } else {
                throw x;
            }
       }
    }
};

$PY.__not__ = function(obj) {
   if (obj.PY$__nonzero__ !== undefined) {
       return js(obj.PY$__nonzero__()) ? False : True;
   } else if (obj.PY$__len__ !== undefined) {
       return js(obj.PY$__len__()) === 0 ? True : False;
   } else {
       return js(obj) ? False : True;
   }
};

$PY.__is__ = function(a, b) {
    return a === b ? True : False;
};

$PY.c_nif = function() {
    throw __builtins__.PY$NotImplementedError("The called function is not implemented in Pyjaco");
};
