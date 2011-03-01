/* Python built-in exceptions */

py_builtins.__exceptions__ = [
    'NotImplementedError',
    'ZeroDivisionError',
    'AssertionError',
    'AttributeError',
    'RuntimeError',
    'ImportError',
    'TypeError',
    'ValueError',
    'NameError',
    'IndexError',
    'KeyError',
    'StopIteration'
];

for (var i in py_builtins.__exceptions__) {
    var name = py_builtins.__exceptions__[i];

    py_builtins[name] = function() {
        return function(message) {
            this.message = defined(message) ? message : "";
        };
    }();

    py_builtins[name].__name__ = name;
    py_builtins[name].prototype.__class__ = py_builtins[name];

    py_builtins[name].prototype.__str__ = function() {
        return str(js(this.__class__.__name__) + ": " + js(this.message));
    };

    py_builtins[name].prototype.toString = function() {
        return js(this.__str__());
    };
}

/* Python built-in functions */

function hasattr(obj, name) {
    return defined(obj[name]);
}

function getattr(obj, name, value) {
    var _value = obj[name];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            throw new py_builtins.AttributeError(obj, name);
        }
    }
}

function setattr(obj, name, value) {
    obj[name] = value;
}

function hash(obj) {
    if (hasattr(obj, '__hash__')) {
        return obj.__hash__();
    } else if (typeof(obj) == 'number') {
        return obj == -1 ? -2 : obj;
    } else {
        throw new py_builtins.AttributeError(obj, '__hash__');
    }
}

function len(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.__len__();
    } else {
        throw new py_builtins.AttributeError(obj, '__name__');
    }
}

function range(start, end, step) {
    if (!defined(end)) {
        end = start;
        start = 0;
    }

    if (!defined(step)) {
        step = 1;
    }

    var seq = [];

    for (var i = start; i < end; i += step) {
        seq.push(i);
    }

    if (py_builtins.__python3__)
        return iter(seq);
    else
        return list(seq);
}

function xrange(start, end, step) {
    return iter(range(start, end, step));
}

function map() {
    if (arguments.length < 2) {
        throw new py_builtins.TypeError("map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw new py_builtins.NotImplementedError("only one sequence allowed in map()");
    }

    var func = arguments[0];
    var seq = iter(arguments[1]);

    var items = list();

    iterate(seq, function(item) {
        items.append(func(item));
    });

    if (py_builtins.__python3__)
        return iter(items);
    else
        return items;
}

function zip() {
    if (!arguments.length) {
        return list();
    }

    var iters = list();
    var i;

    for (i = 0; i < arguments.length; i++) {
        iters.append(iter(arguments[i]));
    }

    var items = list();

    while (true) {
        var item = list();

        for (i = 0; i < arguments.length; i++) {
            try {
                var value = iters.__getitem__(i).next();
            } catch (exc) {
                if (isinstance(exc, py_builtins.StopIteration)) {
                    return items;
                } else {
                    throw exc;
                }
            }

            item.append(value);
        }

        items.append(tuple(item));
    }
}

function isinstance(obj, cls) {
    if (cls instanceof _tuple) {
        var length = cls.__len__();

        if (length == 0) {
            return false;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.__getitem__(i);

            if (isinstance(obj, _cls)) {
                return true;
            }
        }

        return false;
    } else {
        if (defined(obj.__class__) && defined(cls.__name__)) {
            return obj.__class__ == cls;
        } else {
            return obj instanceof cls;
        }
    }
}

py_builtins.bool = function(a) {
    if ((a != null) && defined(a.__bool__))
        return a.__bool__();
    else {
        if (a)
            return true;
        else
            return false;
    }
};

py_builtins.eq = function(a, b) {
    if ((a != null) && defined(a.__eq__))
        return a.__eq__(b);
    else if ((b != null) && defined(b.__eq__))
        return b.__eq__(a);
    else
        return a == b;
};

py_builtins._int = function(value) {
    return value;
};

py_builtins._float = function(value) {
    return value;
};

py_builtins.max = function(list) {
    if (len(list) == 0)
        throw new py_builtins.ValueError("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result == null) || (item > result))
                    result = item;
        });

        return result;
    }
};

py_builtins.min = function(list) {
    if (len(list) == 0)
        throw new py_builtins.ValueError("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter(list), function(item) {
                if ((result == null) || (item < result))
                    result = item;
        });

        return result;
    }
};

py_builtins.sum = function(list) {
    var result = 0;

    iterate(iter(list), function(item) {
        result += item;
    });

    return result;
};

py_builtins.print = function(s) {
    if (typeof(console) != "undefined" && defined(console.log))
        console.log(js(str(s)));
    else {
        if (arguments.length <= 1) {
            if (defined(s))
                print(s);
            else
                print("");
        } else {
            var args = tuple(to_array(arguments));
            print(str(" ").join(args));
        }
    }
};

