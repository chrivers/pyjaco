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

py_builtins.hasattr = function(obj, name) {
    return bool(obj["PY$" + name] !== undefined);
};

py_builtins.getattr = function(obj, name, value) {
    var val = obj["PY$" + name];

    if (val !== undefined) {
        return val;
    } else {
        if (value !== undefined) {
            return value;
        } else {
            throw py_builtins.AttributeError(obj, name);
        }
    }
};

py_builtins.setattr = function(obj, name, value) {
    obj["PY$" + name] = value;
};

py_builtins.js_getattr = function(obj, name, value) {
    var val = obj[name];

    if (val !== undefined) {
        return val;
    } else {
        if (value !== undefined) {
            return value;
        } else {
            throw py_builtins.AttributeError(obj, name);
        }
    }
};

py_builtins.js_setattr = function(obj, name, value) {
    obj[name] = value;
};

py_builtins.delattr = function(obj, name) {
    if (obj["PY$" + name] !== undefined) {
        delete obj["PY$" + name];
    } else {
        throw py_builtins.AttributeError(obj, name);
    }
};

py_builtins.hash = function(obj) {
    if (py_builtins.hasattr(obj, '__hash__') == true) {
        return obj.PY$__hash__();
    } else if (typeof(obj) === 'number') {
        return obj === -1 ? -2 : obj;
    } else {
        throw py_builtins.AttributeError('__hash__');
    }
};

py_builtins.len = function(obj) {
    if (py_builtins.hasattr(obj, '__len__') == true) {
        return obj.PY$__len__();
    } else {
        throw py_builtins.AttributeError('__len__');
    }
};

py_builtins.dir = function(obj) {
    var res = list();
    for (var i in obj) {
        res.PY$append($PY.str(i));
    }
    return res;
};

py_builtins.cmp = function(x, y) {
  return x.PY$__cmp__(y);
};

py_builtins.repr = function(obj) {
    if (obj == undefined) {
        return "None";
    } else if (py_builtins.hasattr(obj, '__repr__') == true) {
        return obj.PY$__repr__(obj);
    } else if (py_builtins.hasattr(obj, '__str__') == true) {
        return obj.PY$__str__(obj);
    } else if (obj.toString !=! undefined) {
        return obj.toString();
    } else {
        throw py_builtins.AttributeError('__repr__, __str__ or toString not found on ' + typeof(obj));
    }
};

py_builtins.range = function(start, end, step) {
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

    if (py_builtins.PY$__python3__)
        return iter(seq);
    else
        return list(seq);
};

py_builtins.xrange = function(start, end, step) {
    return iter(py_builtins.range(start, end, step));
};

py_builtins.map = function() {
    if (arguments.length < 2) {
        throw py_builtins.TypeError("py_builtins.map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw py_builtins.NotImplementedError("only one sequence allowed in py_builtins.map()");
    }

    var func = arguments[0];
    var items = list();

    iterate(arguments[1], function(item) {
        items.PY$append(func(item));
    });

    if (py_builtins.PY$__python3__)
        return iter(items);
    else
        return items;
};

py_builtins.enumerate = function(obj) {
    if (arguments.length != 1) {
        throw py_builtins.NotImplementedError("enumerate() only supports 1 argument");
    }
    var items = list();
    var count = 0;
    iterate(obj, function(elm) {
                items.PY$append(tuple([count++, elm]));
            });
    return items;
};

py_builtins.zip = function() {
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
                if ($PY.isinstance(exc, py_builtins.StopIteration) == true) {
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

py_builtins.isinstance = function(obj, cls) {
    if (cls.PY$__class__ === tuple) {
        var length = cls.PY$__len__();

        if (length.PY$__eq__($c0) == true) {
            return False;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.PY$__getitem__(i);

            if ($PY.isinstance(obj, _cls) == true) {
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

py_builtins.__not__ = function(obj) {
   if (py_builtins.hasattr(obj, '__nonzero__') == true) {
       return bool(!js(obj.PY$__nonzero__()));
   } else if (py_builtins.hasattr(obj, '__len__') == true) {
       return bool(js(obj.PY$__len__()) === 0);
   } else {
       return bool(!js(obj));
   }
};

py_builtins.__is__ = function(a, b) {
    return bool(a === b);
};

py_builtins.max = function(list) {
    if (py_builtins.len(list).PY$__eq__($c0) == true)
        throw py_builtins.ValueError("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(list, function(item) {
                if ((result === null) || js(item.PY$__gt__(result)))
                    result = item;
        });

        return result;
    }
};

py_builtins.min = function(list) {
    if (py_builtins.len(list).PY$__eq__($c0) == true)
        throw py_builtins.ValueError("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(list, function(item) {
                if ((result === null) || js(item.PY$__lt__(result)))
                    result = item;
        });

        return result;
    }
};

py_builtins.sum = function(list) {
    var result = 0;

    iterate(list, function(item) {
        result += js(item);
    });

    return result;
};

py_builtins.filter = function(f, l) {
   var res = list();
   iterate(l, function(item) {
     if (bool(f(item)) == true) {
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
    if (py_builtins.len(seq) < 2) {
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
    for (var i = start; i < py_builtins.len(seq); i++) {
        accum = func(accum, seq.PY$__getitem__(i));
    }
    return accum;
};

if (typeof console !== 'undefined' && console.log !== undefined) {
    py_builtins.print = function()  {
        console.log.apply(null, arguments);
    };
} else if (typeof window === 'undefined' || window.print !== print) {
    py_builtins.print = function() {
        if (arguments.length <= 1) {
            if (arguments[0] !== undefined) {
                print($PY.str(arguments[0]));
            } else {
                print("");
            }
        } else {
            var args = tuple(Array.prototype.slice.call(arguments, 0));
            print($PY.str(" ").PY$join(args));
        }
    };
} else {
    py_builtins.print = function() {
        var args = tuple(Array.prototype.slice.call(arguments, 0));
        alert($PY.str(" ").PY$join(args));
    };
}
