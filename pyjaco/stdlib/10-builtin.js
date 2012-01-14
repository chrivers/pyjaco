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
__builtins__.PY$js_getattr = function(obj, name, value) {
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

__builtins__.PY$js_setattr = function(obj, name, value) {
    obj[name] = value;
};


__builtins__.PY$hasattr = function(obj, name) {
    name = js(name);
    return obj["PY$" + name] === undefined ? False : True;
};

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


__builtins__.PY$setattr = function(obj, name, value) {
    name = js(name);
    obj["PY$" + name] = value;
};

__builtins__.PY$delattr = function(obj, name) {
    name = js(name);
    if (obj["PY$" + name] !== undefined) {
        delete obj["PY$" + name];
    } else {
        throw __builtins__.PY$AttributeError("Object " + js(str(obj)) + " does not have attribute " + name);
    }
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

__builtins__.PY$len = function(obj) {
    if (obj.PY$__len__ !== undefined) {
        return obj.PY$__len__();
    } else {
        throw __builtins__.PY$AttributeError('__len__');
    }
};

__builtins__.PY$dir = function(obj) {
    var res = list();
    for (var i in obj) {
        if (i.indexOf('PY$') !== -1) {
            res.PY$append(__builtins__.PY$str(i.substr(3)));
        }
    }
    res.PY$sort();
    return res;
};

__builtins__.PY$cmp = function(x, y) {
  return x.PY$__cmp__(y);
};

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

__builtins__.PY$xrange = function(start, end, step) {
    return iter(__builtins__.PY$range(start, end, step));
};

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
                if ($PY.isinstance(exc, __builtins__.PY$StopIteration)) {
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

__builtins__.PY$isinstance = function(obj, cls) {
    if (cls.PY$__class__ === tuple) {
        var length = cls.PY$__len__();

        if (length.PY$__eq__($c0) === True) {
            return False;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.PY$__getitem__(i);

            if ($PY.isinstance(obj, _cls)) {
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

__builtins__.PY$__not__ = function(obj) {
   if (obj.PY$__nonzero__ !== undefined) {
       return js(obj.PY$__nonzero__()) ? False : True;
   } else if (obj.PY$__len__ !== undefined) {
       return js(obj.PY$__len__()) === 0 ? True : False;
   } else {
       return js(obj) ? False : True;
   }
};

__builtins__.PY$__is__ = function(a, b) {
    return a === b ? True : False;
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

__builtins__.PY$sum = function(list) {
    var result = 0;

    iterate(list, function(item) {
        result += js(item);
    });

    return result;
};

__builtins__.PY$filter = function(f, l) {
   var res = list();
   iterate(l, function(item) {
     if (f(item) === True) {
       res.PY$append(item);
     }
   });
   return res;
};

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

__builtins__.PY$sorted = function(iterable) {
    var l = list(iterable);
    l.PY$sort();
    return l;
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
