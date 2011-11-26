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
    var seq = iter(obj);
    while (true) {
        try {
            func(seq.PY$next());
        } catch (exc) {
            if ($PY.isinstance(exc, py_builtins.StopIteration) == true) {
                break;
            } else {
                throw exc;
            }
        }
    }
}

var __kwargs_make = function(kw) {
    kw.__kwargs = true;
    return kw;
};

var __varargs_make = function(vr) {
    vr = tuple(vr);
    vr.__varargs = true;
    return vr;
};

var __varargs_get = function(args) {
    if (args.length && (args[args.length-1].__varargs === true)) {
        var vargs = args[args.length-1];
        args.length -= 1;
        return vargs;
    } else {
        return tuple();
    }
};

var __kwargs_get = function(args) {
    if (args.length && (args[args.length-1].__kwargs === true)) {
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
        return func.apply(null, [this].concat(Array.prototype.slice.call(arguments)));
    };
    res.__static = true;
    return res;
};

var js = function(obj) {
    /*
       Converts (recursively) a Python object to a javascript builtin object.

       In particular:

       tuple -> Array
       list -> Array
       dict -> Object

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
    } else if (typeof obj == 'string') {
        return str(obj);
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
