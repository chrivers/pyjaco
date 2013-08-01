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

var __inherit = function(cls, name) {

    if (name === undefined) {
        throw __builtins__.PY$TypeError("The function __inherit must get exactly 2 arguments");
    }

    var res = function() {
        var x = res.PY$__create__;
        if (x !== undefined) {
            return res.PY$__create__.apply(null, [res].concat(Array.prototype.slice.call(arguments)));
        } else {
            throw __builtins__.PY$AttributeError("Class " + name + " does not have __create__ method");
        }
    };

    for (var o in cls) {
        res[o] = cls[o];
    }

    res.PY$__name__  = name;
    res.PY$__super__ = cls;
    res.__isclass = true;
    res.__isinstance = false;
    return res;
};

var object = __inherit(null, "object");

__builtins__.PY$object = object;

object.PY$__init__ = function() {
};

object.PY$__create__ = function(cls) {
    var args = Array.prototype.slice.call(arguments, 1);

    var obj = function() {
        var x = cls.PY$__call__;
        if (x !== undefined) {
            return cls.PY$__call__.apply(cls, args);
        } else {
            throw __builtins__.PY$AttributeError("Object " + js(cls.PY$__name__) + " does not have __call__ method");
        }
    };

    if (obj.__proto__ === undefined) {
        var x = function() {};
        x.prototype = cls;
        obj = new x();
    } else {
        obj.__proto__ = cls;
    };

    obj.PY$__class__ = cls;
    obj.PY$__super__ = undefined;
    obj.id = prng();
    obj.__isinstance = true;
    obj.__isclass = false;
    obj.PY$__init__.apply(obj, args);
    return obj;
};

$PY.setattr = function(obj, k, v) {
    obj["PY$" + k] = v;
};

$PY.getattr = function(obj, k) {
    var name = "PY$" + k;
    var res;
    var debug = true;
    debug = false;
    if ("PY$__getattribute__" in obj) {
        return obj.PY$__getattribute__(k);
    } else if (name in obj) {
        res = obj[name];
        debug && print(sprintf("case1(%s): typeof==function: %s, obj.isinstance:%s, res.isinstance:%s, obj.isclass: %s, res.isclass:%s", list([
              py(name),
              py(typeof res === 'function'),
              py(obj.__isinstance),
              py(res.__isinstance),
              py(obj.__isclass),
              py(res.__isclass)])));
        if (typeof res === 'function' && !(res.__isclass || res.__isinstance)) {
            if (obj.__isinstance) {
                if (res.__static) {
                    return function() { return res.apply(arguments[0], Array.prototype.slice.call(arguments, 1)); };
                } else {
                    return function() { return res.apply(obj, arguments); };
                }
            } else {
                return function() { return res.apply(arguments[0], Array.prototype.slice.call(arguments, 1)); };
            }
        } else if (k === "__name__") {
            return str(res);
        } else {
            return res;
        }
    } else if (obj.PY$__class__ && name in obj.PY$__class__) {
        res = obj.PY$__class__[name];
        debug && print("case2", typeof res === 'function');
        if (typeof res === 'function' && obj.__isinstance) {
            return function() { return res.apply(obj.PY$__class__, arguments); };
        } else {
            return res;
        }
    } else if ("PY$__getattr__" in obj) {
        res = obj.PY$__getattr__(k);
        debug && print(sprintf("case3(%s): typeof==function: %s, obj.isinstance:%s, res.isinstance:%s, obj.hasclass:%s, res.hasclass:%s, obj.isclass: %s, res.isclass:%s", list([
              py(name),
              py(typeof res === 'function'),
              py(obj.__isinstance),
              py(res.__isinstance),
              py(obj.PY$__class__ !== undefined),
              py(res.PY$__class__ !== undefined),
              py(obj.__isclass),
              py(res.__isclass)])));
        return res;
    }
    throw __builtins__.PY$AttributeError(js(obj.PY$__repr__()) + " does not have attribute '" + js(k) + "'");
};

$PY.delattr = function(obj, k) {
    delete obj["PY$" + k];
};

object.PY$__repr__ = function() {
    if (this.PY$__class__) {
        return str("<instance of " + this.PY$__class__.PY$__name__ + " at 0x" + this.id.toString(16) + ">");
    } else if (this.PY$__name__) {
        return str("<type '" + this.PY$__name__ + "'>");
    } else {
        return str("<javascript: " + this + ">");
    }
};

object.PY$__str__ = object.PY$__repr__;

object.PY$__eq__ = function(other) {
    return this === other ? True : False;
};

object.PY$__ne__ = function (other) {
    return $PY.__not__(this.PY$__eq__(other));
};

object.PY$__gt__ = function(other) {
    if (this.PY$__class__ === undefined) {
        return this.PY$__name__ > other.PY$__name__ ? True : False;
    } else {
        return this.PY$__class__.PY$__name__ > other.PY$__class__.PY$__name__ ? True : False;
    }
};

object.PY$__lt__ = function(other) {
    if (other === this) {
        return False;
    } else {
        if (this.PY$__class__ === undefined) {
            return this.PY$__name__ < other.PY$__name__ ? True : False;
        } else {
            return this.PY$__class__.PY$__name__ < other.PY$__class__.PY$__name__ ? True : False;
        }
    }
};

object.PY$__ge__ = function(other) {
    return this.PY$__lt__(other) === False ? True : False;
};

object.PY$__le__ = function(other) {
    return this.PY$__gt__(other) === False ? True : False;
};

object.PY$__cmp__ = function (y) {
    if (this.PY$__gt__(y) === True) {
        return $c1;
    } else {
        if (this.PY$__lt__(y) === True) {
            return $cn1;
        } else {
            return $c0;
        }
    }
};

object.toString = function () {
    return js(this.PY$__str__());
};

object.valueOf = function () {
    return js(this);
};
