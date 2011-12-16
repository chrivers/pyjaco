/**
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
"use strict";

var $PY = {};

var py_builtins = {};

py_builtins.PY$__python3__ = false;

function bt() {
    try {
        null();
    } catch (x) {
        py_builtins.print(x.stack);
    }
}

function iterate(obj, func) {
    if (obj.PY$__class__ === undefined) {
        for (var i in obj) {
            func(obj[i]);
        };
    } else if (obj.PY$__class__ === list || obj.PY$__class__ === tuple) {
        for (var i = 0; i < obj.items.length; i++) {
            func(obj.items[i]);
        };
    } else {
        var seq = iter(obj);
        while (true) {
            try {
                func(seq.PY$next());
            } catch (exc) {
                if (exc === $PY.StopIter || $PY.isinstance(exc, py_builtins.StopIteration)) {
                    break;
                } else {
                    throw exc;
                }
            }
        }
    }
}

var __kwargs_make = function(kw, kwargs) {
    kw.__kwargs = true;
    if (kwargs !== undefined) {
        if (kwargs.PY$__class__ !== dict) {
            throw TypeError("Keyword arguments with non-standard dictionary types not supported");
        }
        for (var key in kwargs.items) {
            kw[key] = kwargs.items[key];
        };
    };
    return kw;
};

var __varargs_make = function(vr) {
    vr = tuple(vr);
    vr.__varargs = true;
    return vr;
};

var __varargs_get = function(args) {
    if (args.length && (args[args.length-1] !== undefined) && (args[args.length-1].__varargs === true)) {
        var vargs = args[args.length-1];
        args.length -= 1;
        return vargs;
    } else {
        return $PY.$c_emptytuple;
    }
};

var __kwargs_get = function(args) {
    if (args.length && (args[args.length-1] !== undefined) && (args[args.length-1].__kwargs === true)) {
        delete args[args.length-1].__kwargs;
        var res = args[args.length-1];
        delete args[args.length-1];
        args.length -= 1;
        return res;
    } else {
        return [];
    }
};

var staticmethod = function(func) {
    var res = function () {
        return func.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
    };
    res.__static = true;
    return res;
};

var js = function(obj) {
    /*
       Converts (recursively) a Python object to a javascript builtin object.

       In particular:

       tuple -> Array
       list  -> Array
       dict  -> Object
       bool  -> Boolean
       int   -> Number
       float -> Number
       None  -> null

       It uses the obj._js_() if it is defined, otherwise it just returns the
       same object. It is the responsibility of _js_() to convert recursively
       the object itself.
    */
    if ((obj != null) && obj._js_ !== undefined)
        return obj._js_();
    else
        return obj;
};

var py = function(obj) {
    if (obj && obj.PY$__class__ !== undefined) {
        return obj;
    } else if (typeof obj === 'number') {
        return int(obj);
    } else if (typeof obj === 'string') {
        return str(obj);
    } else if (typeof obj === 'boolean') {
        return bool(obj);
    } else if (obj === undefined || obj === null) {
        return None;
    } else if (obj instanceof Array) {
        var res = list();
        for (var q in obj) {
          res.PY$append(py(obj[q]));
        }
        return res;
    } else {
        var res = dict();
        for (var q in obj) {
            res.PY$__setitem__(q, py(obj[q]));
        }
        return res;
    }
};

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
    if (obj.PY$__repr__ !== undefined) {
        return obj.PY$__repr__()._js_();
    } else {
        return obj.toString();
    }
};

$PY.len = function(obj) {
    var c = obj.PY$__class__;
    if (c === list || c === tuple || c === str || c === basestring || c === unicode) {
        return obj.obj.length;
    } else if (obj.PY$__len__ !== undefined) {
        return obj.PY$__len__()._js_();
    } else {
        throw py_builtins.AttributeError('__len__');
    }
};