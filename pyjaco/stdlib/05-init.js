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

var $PY = {};

$PY.prng = 42;

$PY.c_emptycook = {"varargs": [], "kw": []};

var __builtins__ = {};

__builtins__.PY$__python3__ = false;

function prng() {
    $PY.prng = ($PY.prng * 0x8088405 + 1) % 0xFFFFFFFF;
    // Align to 16 bytes just to make it seam more real :-)
    return $PY.prng & 0x7FFFFFF0;
}

function bt() {
    try {
        null();
    } catch (x) {
        __builtins__.PY$print(x.stack);
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
                if (exc === $PY.c_stopiter || $PY.isinstance(exc, __builtins__.PY$StopIteration)) {
                    break;
                } else {
                    throw exc;
                }
            }
        }
    }
}

var __uncook = function(args) {
    var last = args.length-1;
    if (args.length && (typeof args[last] === 'object') && (args[last].varargs !== undefined)) {
        var res = args[last];
        delete args[last];
        args.length -= 1;
        if (res.varargs.PY$__class__ === tuple || res.varargs.PY$__class__ === list) {
            res.varargs = res.varargs.items;
        } else {
            res.varargs = tuple(res.varargs).items;
        }
        if (!("kw" in res)) {
            res.kw = [];
        }
        if (res.kwargs !== undefined) {
            var items = res.kwargs.items;
            for (var hash in items) {
                var item = items[hash];
                res.kw[js(item[0])] = item[1];
            }
        }
        return res;
    } else {
        return $PY.c_emptycook;
    }
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
            res.PY$__setitem__(str(q), py(obj[q]));
        }
        return res;
    }
};
