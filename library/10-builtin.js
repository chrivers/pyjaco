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

var hasattr = function(obj, name) {
    return (typeof obj["PY$" + name]) != 'undefined';
};

var getattr = function(obj, name, value) {
    var _value = obj["PY$" + name];

    if ((typeof _value) != 'undefined') {
        return _value;
    } else {
        if ((typeof value) != 'undefined') {
            return value;
        } else {
            throw py_builtins.AttributeError(obj, name);
        }
    }
};

var setattr = function(obj, name, value) {
    obj["PY$" + name] = value;
};

var hash = function(obj) {
    if (hasattr(obj, '__hash__')) {
        return obj.PY$__hash__();
    } else if (typeof(obj) === 'number') {
        return obj === -1 ? -2 : obj;
    } else {
        throw py_builtins.AttributeError('__hash__');
    }
};

var len = function(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.PY$__len__();
    } else {
        throw py_builtins.AttributeError('__len__');
    }
};

var dir = function(obj) {
    var res = list();
    for (var i in obj) {
        res.PY$append(__py2js_str(i));
    }
    return res;
};

var repr = function(obj) {
    if (!defined(obj)) {
        return "None";
    } else if (hasattr(obj, '__repr__')) {
        return obj.PY$__repr__.call(obj);
    } else if (hasattr(obj, '__str__')) {
        return obj.PY$__str__.call(obj);
    } else if (typeof obj.toString != 'undefined') {
        return obj.toString();
    } else {
        throw py_builtins.AttributeError('__repr__, __str__ or toString not found on ' + typeof(obj));
    }
};

var range = function(start, end, step) {
    start = js(start);

    if (!defined(end)) {
        end = start;
        start = 0;
    } else {
        end = js(end);
    }

    if (!defined(step)) {
        step = 1;
    } else {
        step = js(step);
    }

    var seq = [];

    for (var i = start; i < end; i += step) {
        seq.push(i);
    }

    if (py_builtins.PY$__python3__)
        return iter(seq);
    else
        return list(seq);
};

var xrange = function(start, end, step) {
    return iter(range(start, end, step));
};

var map = function() {
    if (arguments.length < 2) {
        throw py_builtins.TypeError("map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw py_builtins.NotImplementedError("only one sequence allowed in map()");
    }

    var func = arguments[0];
    var seq = iter(arguments[1]);

    var items = list();

    iterate(seq, function(item) {
        items.PY$append(func(item));
    });

    if (py_builtins.PY$__python3__)
        return iter(items);
    else
        return items;
};

var zip = function() {
    if (!arguments.length) {
        return list();
    }

    var iters = list();
    var i;

    for (i = 0; i < arguments.length; i++) {
        iters.PY$append(iter(arguments[i]));
    }

    var items = list();

    while (true) {
        var item = list();

        for (i = 0; i < arguments.length; i++) {
            try {
                var value = iters.PY$__getitem__(i).PY$next();
            } catch (exc) {
                if (js(isinstance(exc, py_builtins.StopIteration))) {
                    return items;
                } else {
                    throw exc;
                }
            }

            item.PY$append(value);
        }

        items.PY$append(tuple(item));
    }
    return None;
};

var isinstance = function(obj, cls) {
    if (cls.PY$__class__ === tuple) {
        var length = cls.PY$__len__();

        if (js(length.PY$__eq__($c0))) {
            return False;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.PY$__getitem__(i);

            if (js(isinstance(obj, _cls))) {
                return True;
            }
        }

        return False;
    } else {
        var c = obj.PY$__class__;
        while (c) {
            if (c === cls)
                return True;
            c = c.PY$__super__;
        }
        return False;
    }
};

py_builtins.bool = function(a) {
    if ((a !== null) && defined(a.PY$__bool__)) {
        return a.PY$__bool__();
    } else {
        if (a) {
            return True;
        } else {
            return False;
        }
    }
};

py_builtins.eq = function(a, b) {
    if ((a != null) && defined(a.PY$__eq__))
        return a.PY$__eq__(b);
    else if ((b != null) && defined(b.PY$__eq__))
        return b.PY$__eq__(a);
    else
        return bool(a === b);
};

py_builtins._int = function(value) {
    if (typeof(value) === "number") {
        return _int(parseInt(value, 10));
    } else if (js(isinstance(value, _int))) {
        return value;
    } else if (js(isinstance(value, _float))) {
        return _int(parseInt(value._obj, 10));
    } else {
        var s = value.toString();
        if (s.match(/^[-+0-9]+$/)) {
            return _int(parseInt(value, 10));
        } else {
            throw py_builtins.ValueError("Invalid integer: " + value);
        }
    }
};

py_builtins.__not__ = function(obj) {
   if (hasattr(obj, '__nonzero__')) {
       return py_builtins.bool(!js(obj.PY$__nonzero__()));
   } else if (hasattr(obj, '__len__')) {
       return py_builtins.bool(js(obj.PY$__len__()) === 0);
   } else {
       return py_builtins.bool(!js(obj));
   }
};

py_builtins.__is__ = function(a, b) {
    return py_builtins.bool(a === b);
};

py_builtins._float = function(value) {
    if (typeof(value) === "number") {
        return _float(parseFloat(value));
    } else if (js(isinstance(value, _int))) {
        return _float(parseFloat(value._obj));
    } else if (js(isinstance(value, _float))) {
        return value;
    } else {
        var s = value.toString();
        if (s.match(/^[-+]?[0-9]+(\.[0-9]*)?$/)) {
            return _float(parseFloat(value));
        } else {
            throw py_builtins.ValueError("Invalid float: " + value);
        }
    }
};

py_builtins.max = function(list) {
    if (js(len(list).PY$__eq__($c0)))
        throw py_builtins.ValueError("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result === null) || js(item.PY$__gt__(result)))
                    result = item;
        });

        return result;
    }
};

py_builtins.min = function(list) {
    if (js(len(list).PY$__eq__($c0)))
        throw py_builtins.ValueError("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result === null) || js(item.PY$__lt__(result)))
                    result = item;
        });

        return result;
    }
};

py_builtins.sum = function(list) {
    var result = 0;

    iterate(iter(list), function(item) {
        result += js(item);
    });

    return result;
};

py_builtins.print = function(s) {
    if (typeof(console) != "undefined" && defined(console.log)) {
        console.log.apply(null, arguments);
    } else {
        if (arguments.length <= 1) {
            if (defined(s)) {
                print(__py2js_str(s));
            } else {
                print("");
            }
        } else {
            var args = tuple(Array.prototype.slice.call(arguments, 0));
            print(__py2js_str(" ").PY$join(args));
        }
    }
};

py_builtins.filter = function(f, l) {
   var res = list();
   iterate(iter(l), function(item) {
     if (py_builtins.bool(f(item))) {
       res.PY$append(item);
     }
   });
   return res;
};

py_builtins.reduce = function(func, seq) {
    var initial;
    if (arguments.length == 3) {
        initial = arguments[2];
    } else {
        initial = null;
    }
    if (len(seq) < 2) {
        return initial;
    }
    var accum, start;
    if (arguments.length == 3) {
        accum = initial;
        start = 0;
    } else {
        accum = func(seq.PY$__getitem__(0), seq.PY$__getitem__(1));
        start = 2;
    }
    for (var i = start; i < len(seq); i++) {
        accum = func(accum, seq.PY$__getitem__(i));
    }
    return accum;
};
