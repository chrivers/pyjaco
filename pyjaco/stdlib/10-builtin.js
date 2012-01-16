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

/*
 * Bastardized javascript-python builtins. Will be moved in the future
 */
__builtins__.js_getattr = function(obj, name, value) {
    var val = obj[name];

    if (val !== undefined) {
        return val;
    } else {
        if (value !== undefined) {
            return value;
        } else {
            throw __builtins__.PY$AttributeError("Object " + js(str(obj)) + " does not have attribute " + name);
        }
    }
};

__builtins__.js_setattr = function(obj, name, value) {
    obj[name] = value;
};

/*
 * Python __builtins__
 */

__builtins__.PY$abs = $PY.c_nif;
__builtins__.PY$all = $PY.c_nif;
__builtins__.PY$any = $PY.c_nif;

__builtins__.PY$apply = function(fun, vargs, kwargs) {
    if (vargs === undefined) {
        return fun();
    } else {
        if (kwargs === undefined) {
            return fun(__varargs_make(vargs));
        } else {
            return fun(__varargs_make(vargs), __kwargs_make(kwargs));
        }
    }
};

__builtins__.PY$bin = function(num) {
    if (num.PY$__class__ === __builtins__.PY$int) {
        var bin = num._js_().toString(2);
        if (bin.charAt(0) === "-") {
            return __builtins__.PY$str("-0b" + bin.substr(1));
        } else {
            return __builtins__.PY$str("0b" + bin);
        }
    } else {
        throw __builtins__.PY$TypeError("'" + num.PY$__class__.PY$__name__ + "' object cannot be interpreted as an index");
    }
};

__builtins__.PY$buffer = $PY.c_nif;
__builtins__.PY$bytearray = $PY.c_nif;
__builtins__.PY$bytes = $PY.c_nif;

__builtins__.PY$callable = function(obj) {
    if (typeof obj === "function" && obj.PY$__class__ === undefined) {
        return True;
    } else {
        return __builtins__.PY$hasattr(obj, "__call__");
    }
};

__builtins__.PY$chr = function(chr) {
    var s = String.fromCharCode(chr._js_());
    if (s === "\0") {
        throw __builtins__.PY$TypeError("an integer is required");
    } else {
        return __builtins__.PY$str(s);
    }
};

__builtins__.PY$classmethod = $PY.c_nif;

__builtins__.PY$cmp = function(x, y) {
    return x.PY$__cmp__(y);
};

__builtins__.PY$coerce = $PY.c_nif;
__builtins__.PY$compile = $PY.c_nif;
__builtins__.PY$complex = $PY.c_nif;
__builtins__.PY$copyright = $PY.c_nif;
__builtins__.PY$credits = $PY.c_nif;

__builtins__.PY$delattr = function(obj, name) {
    name = js(name);
    if (obj["PY$" + name] !== undefined) {
        delete obj["PY$" + name];
    } else {
        throw __builtins__.PY$AttributeError("Object " + js(str(obj)) + " does not have attribute " + name);
    }
};

__builtins__.PY$dir = function(obj) {
    var res = list();
    for (var i in obj) {
        if (i.indexOf('PY$') === 0) {
            res.PY$append(__builtins__.PY$str(i.substr(3)));
        }
    }
    res.PY$sort();
    return res;
};

__builtins__.PY$divmod = $PY.c_nif;

__builtins__.PY$enumerate = function(obj) {
    if (arguments.length != 1) {
        throw __builtins__.PY$NotImplementedError("enumerate() only supports 1 argument");
    }
    var items = list();
    var count = 0;
    iterate(obj, function(elm) {
                items.PY$append(tuple([count++, elm]));
            });
    return items;
};

__builtins__.PY$eval = $PY.c_nif;
__builtins__.PY$execfile = $PY.c_nif;
__builtins__.PY$exit = $PY.c_nif;
__builtins__.PY$file = $PY.c_nif;

__builtins__.PY$filter = function(f, l) {
   var res = list();
   iterate(l, function(item) {
     if (f(item) === True) {
       res.PY$append(item);
     }
   });
   return res;
};

__builtins__.PY$format = $PY.c_nif;
__builtins__.PY$frozenset = $PY.c_nif;

__builtins__.PY$getattr = function(obj, name, value) {
    name = js(name);
    var val = obj["PY$" + name];

    if (val !== undefined) {
        return val;
    } else {
        if (value !== undefined) {
            return value;
        } else {
            throw __builtins__.PY$AttributeError("Object " + js(str(obj)) + " does not have attribute " + name);
        }
    }
};

__builtins__.PY$globals = $PY.c_nif;

__builtins__.PY$hasattr = function(obj, name) {
    name = js(name);
    return obj["PY$" + name] === undefined ? False : True;
};


__builtins__.PY$hash = function(obj) {
    if (obj.PY$__hash__ !== undefined) {
        return obj.PY$__hash__();
    } else if (typeof(obj) === 'number') {
        return obj === -1 ? -2 : obj;
    } else {
        throw __builtins__.PY$AttributeError('__hash__');
    }
};

__builtins__.PY$help = function() {
    __builtins__.PY$print("Welcome to pyjaco, the Python-to-Javascript compiler!\n" +
                          "  Homepage     : pyjaco.org\n" +
                          "  Github       : https://github.com/chrivers/pyjaco\n" +
                          "  Email        : developer@pyjaco.org\n" +
                          "  Google group : http://groups.google.com/group/pyjaco");
};

__builtins__.PY$hex = function(num) {
    if (num.PY$__class__ === __builtins__.PY$int) {
        var hex = num._js_().toString(16);
        if (hex.charAt(0) === "-") {
            return __builtins__.PY$str("-0x" + hex.substr(1));
        } else {
            return __builtins__.PY$str("0x" + hex);
        }
    } else {
        throw __builtins__.PY$TypeError("hex() argument can't be converted to hex");
    }
};

__builtins__.PY$id = function(obj) {
    return __builtins__.PY$int(obj.id);
}

__builtins__.PY$input = $PY.c_nif;

__builtins__.PY$intern = function(x) {
    if ($PY.isinstance(x, __builtins__.PY$basestring)) {
        // pass
    } else {
        throw __builtins__.PY$TypeError("must be string, not " + x.PY$__class__.PY$__name__);
    }
};

__builtins__.PY$isinstance = function(obj, cls) {
    if (cls.PY$__class__ === tuple) {
        var length = cls.PY$__len__()._js_();
        obj = obj.PY$__class__;
        while (obj) {
            for (var i = 0; i < length; i++) {
                if (obj === cls.PY$__getitem__(i))
                    return True;
            }
            obj = obj.PY$__super__;
        }

        return False;
    } else if (cls.PY$__super__ !== undefined) {
        var c = obj.PY$__class__;
        while (c) {
            if (c === cls)
                return True;
            c = c.PY$__super__;
        }
        return False;
    } else {
        throw __builtins__.PY$TypeError("isinstance() arg 2 must be a class, type, or tuple of classes and types");
    }
};

__builtins__.PY$issubclass = function(obj, cls) {
    if (cls.PY$__class__ === tuple) {
        var length = cls.PY$__len__()._js_();

        while (obj) {
            for (var i = 0; i < length; i++) {
                if (obj === cls.PY$__getitem__(i))
                    return True;
            }
            obj = obj.PY$__super__;
        }

        return False;
    } else if (cls.PY$__super__ !== undefined) {
        while (obj) {
            if (obj === cls)
                return True;
            obj = obj.PY$__super__;
        }
        return False;
    } else {
        throw __builtins__.PY$TypeError("issubclass() arg 2 must be a class or tuple of classes");
    }
};


__builtins__.PY$len = function(obj) {
    if (obj.PY$__len__ !== undefined) {
        return obj.PY$__len__();
    } else {
        throw __builtins__.PY$AttributeError('__len__');
    }
};

__builtins__.PY$license = $PY.c_nif;
__builtins__.PY$locals = $PY.c_nif;
__builtins__.PY$long = $PY.c_nif;

__builtins__.PY$map = function() {
    if (arguments.length < 2) {
        throw __builtins__.PY$TypeError("__builtins__.PY$map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw __builtins__.PY$NotImplementedError("only one sequence allowed in __builtins__.PY$map()");
    }

    var func = arguments[0];
    var items = list();

    iterate(arguments[1], function(item) {
        items.PY$append(func(item));
    });

    if (__builtins__.PY$__python3__)
        return iter(items);
    else
        return items;
};

__builtins__.PY$max = function(list) {
    if (__builtins__.PY$len(list).PY$__eq__($c0) === True)
        throw __builtins__.PY$ValueError("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(list, function(item) {
                if ((result === null) || js(item.PY$__gt__(result)))
                    result = item;
        });

        return result;
    }
};

__builtins__.PY$memoryview = $PY.c_nif;

__builtins__.PY$min = function(list) {
    if (__builtins__.PY$len(list).PY$__eq__($c0) === True)
        throw __builtins__.PY$ValueError("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(list, function(item) {
                if ((result === null) || js(item.PY$__lt__(result)))
                    result = item;
        });

        return result;
    }
};

__builtins__.PY$next = $PY.c_nif;

__builtins__.PY$oct = function(num) {
    if (num.PY$__class__ === __builtins__.PY$int) {
        var oct = num._js_().toString(8);
        if (oct.charAt(0) === "-") {
            return __builtins__.PY$str("-0" + oct.substr(1));
        } else if (oct === "0") {
            return __builtins__.PY$str("0");
        } else {
            return __builtins__.PY$str("0" + oct);
        }
    } else {
        throw __builtins__.PY$TypeError("oct() argument can't be converted to oct");
    }
};

__builtins__.PY$open = $PY.c_nif;

__builtins__.PY$ord = function(ord) {
    var s = ord._js_();
    if (s.length === 1) {
        return __builtins__.PY$int(s.charCodeAt(0));
    } else {
        throw __builtins__.PY$TypeError("ord() expected a character, but string of length " + s.length + " found");
    }
};


__builtins__.PY$pow = function(x, y, z) {
    if (z !== undefined) {
        throw __builtins__.PY$NotImplemented("Pyjaco does not support the 3-operand version of pow()");
    } else if (x.PY$__pow__ !== undefined) {
        if (y.obj < 0) {
            return __builtins__.PY$float(x).PY$__pow__(y);
        } else {
            return x.PY$__pow__(y);
        }
    } else {
        throw __builtins__.PY$TypeError("unsupported operand type(s) for ** or pow(): '" +
                                        x.PY$__class__.PY$__name__ + "' and '" +
                                        y.PY$__class__.PY$__name__ + "'");
    }
};

if (typeof console !== 'undefined' && console.log !== undefined) {
    if (console.log.apply !== undefined) {
        __builtins__.PY$print = function()  {
            console.log.apply(console, arguments);
        };
    } else {
        __builtins__.PY$print = function()  {
            var args = js(str(" ").PY$join(tuple(Array.prototype.slice.call(arguments))));
            console.log(args);
        };
    }
} else if (typeof WScript !== 'undefined') {
    __builtins__.PY$print = function() {
        var args = js(str(" ").PY$join(tuple(Array.prototype.slice.call(arguments))));
        WScript.Echo(args);
    };
} else if (typeof window === 'undefined' || window.print !== print) {
    __builtins__.PY$print = function() {
        if (arguments.length <= 1) {
            if (arguments[0] !== undefined) {
                print(__builtins__.PY$str(arguments[0]));
            } else {
                print("");
            }
        } else {
            print.apply(null, arguments);
        }
    };
} else {
    __builtins__.PY$print = function() {
        var args = tuple(Array.prototype.slice.call(arguments));
        alert(js(__builtins__.PY$str(" ").PY$join(__builtins__.PY$map(__builtins__.PY$repr, args))));
    };
}

__builtins__.PY$property = $PY.c_nif;

__builtins__.PY$quit = function() {
    if (quit !== undefined) {
        quit();
    } else {
        throw __builtins__.PY$SystemExit("quit");
    }
};

__builtins__.PY$range = function(start, end, step) {
    start = js(start);

    if (end === undefined) {
        end = start;
        start = 0;
    } else {
        end = js(end);
    }

    if (step === undefined) {
        step = 1;
    } else {
        step = js(step);
    }

    var seq = [];

    for (var i = start; i < end; i += step) {
        seq.push(i);
    }

    if (__builtins__.PY$__python3__)
        return iter(seq);
    else
        return list(seq);
};

__builtins__.PY$raw_input = $PY.c_nif;

__builtins__.PY$reduce = function(func, seq) {
    var initial;
    if (arguments.length === 3) {
        initial = arguments[2];
    } else {
        initial = null;
    }
    if (__builtins__.PY$len(seq)._js_() < 2) {
        return initial;
    }
    var accum, start;
    if (arguments.length === 3) {
        accum = initial;
        start = 0;
    } else {
        accum = func(seq.PY$__getitem__(0), seq.PY$__getitem__(1));
        start = 2;
    }
    for (var i = start; i < __builtins__.PY$len(seq)._js_(); i++) {
        accum = func(accum, seq.PY$__getitem__(i));
    }
    return accum;
};

__builtins__.PY$reload = $PY.c_nif;

__builtins__.PY$repr = function(obj) {
    if (obj === undefined) {
        return str("None");
    } else if (obj.PY$__class__ === undefined) {
        return object.PY$__repr__.call(obj);
    } else if (obj.PY$__repr__ !== undefined) {
        return obj.PY$__repr__(obj);
    } else if (obj.PY$__str__ !== undefined) {
        return obj.PY$__str__(obj);
    } else {
        throw __builtins__.PY$AttributeError('__repr__ or __str__ not found on ' + typeof(obj));
    }
};

__builtins__.PY$reversed = function(iterable) {
    var l = list(iterable);
    l.PY$reverse();
    return l;
}

__builtins__.PY$round = function(num) {
    if (num.PY$__class__ === __builtins__.PY$float) {
        var n = num.obj;
        if (n < 0) {
            return __builtins__.PY$float(-Math.round(-num.obj));
        } else {
            return __builtins__.PY$float(Math.round(num.obj));
        }
    } else if (num.PY$__class__ === __builtins__.PY$int) {
        return __builtins__.PY$float(num.obj);
    } else {
        throw __builtins__.PY$TypeError("a float is required");
    }
};

__builtins__.PY$set = $PY.c_nif;

__builtins__.PY$setattr = function(obj, name, value) {
    name = js(name);
    obj["PY$" + name] = value;
};

__builtins__.PY$sorted = function(iterable) {
    var l = list(iterable);
    l.PY$sort();
    return l;
};

__builtins__.PY$staticmethod = function(func) {
    var res = function () {
        return func.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
    };
    res.__static = true;
    return res;
};

__builtins__.PY$sum = function(list) {
    var result = 0;

    iterate(list, function(item) {
        result += js(item);
    });

    return result;
};

__builtins__.PY$type = function(obj) {
    if (obj && obj.PY$__class__) {
        return obj.PY$__class__;
    } else {
        return __builtins__.PY$None;
    }
};

__builtins__.PY$unichr = function(unichr) {
    var s = String.fromCharCode(unichr._js_());
    if (s === "\0") {
        throw __builtins__.PY$TypeError("an integer is required");
    } else {
        return __builtins__.PY$unicode(s);
    }
};

__builtins__.PY$vars = $PY.c_nif;

__builtins__.PY$xrange = function(start, end, step) {
    return iter(__builtins__.PY$range(start, end, step));
};

__builtins__.PY$zip = function() {
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
                if (exc === $PY.c_stopiter || $PY.isinstance(exc, __builtins__.PY$StopIteration)) {
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
