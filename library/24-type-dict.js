/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
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

var dict = __inherit(object, "dict");

$PY.dict = dict;

dict.PY$__init__ = function() {
    var items;
    var key;
    var value;

    var kwargs = __kwargs_get(arguments);
    var args = arguments[0];
    if (args !== undefined) {
        if (args.PY$__iter__ !== undefined) {
            items = {};
            iterate(args, function(item) {
                    key = item.PY$__getitem__(0);
                    value = item.PY$__getitem__(1);
                    items[key] = value;
            });
            this.items = items;
        } else if (args.length === undefined) {
            this.items = args;
        } else {
            this.items = {};
            for (var i = 0; i < args.length / 2; i++) {
                this.items[args[i*2]] = args[i*2+1];
            }
        }
    } else {
        this.items = {};
    }
    for (var p in kwargs) {
        this.items[p] = kwargs[p];
    }
};

dict.PY$__str__ = function () {
    var strings = [];

    for (var key in this.items) {
        strings.push(py_builtins.repr(str(key)) + ": " + py_builtins.repr(this.items[key]));
    }

    return str("{" + strings.join(", ") + "}");
};

dict.PY$__repr__ = dict.PY$__str__;

dict._js_ = function () {
    var items = {};

    var that = this; // so that we can access it from within the closure:
    iterate(this, function(key) {
        items[key] = js(that.PY$__getitem__(key));
    });

    return items;
};

dict.PY$__hash__ = function () {
    throw py_builtins.TypeError("unhashable type: 'dict'");
};

dict.PY$__len__ = function() {
    var count = 0;

    for (var key in this.items)
        count += 1;

    return int(count);
};

dict.PY$__iter__ = function() {
    return iter(this.PY$keys());
};

dict.PY$__contains__ = function(key) {
    return bool(this.items[key] !== undefined);
};

dict.PY$__getitem__ = function(key) {
    var value = this.items[key];

    if (value !== undefined) {
        return value;
    } else {
        throw py_builtins.KeyError(str(key));
    }
};

dict.PY$__setitem__ = function(key, value) {
    this.items[key] = value;
};

dict.PY$__delitem__ = function(key) {
    if (this.PY$__contains__(key) == true) {
        delete this.items[key];
    } else {
        throw py_builtins.KeyError(str(key));
    }
};

dict.PY$get = function(key, value) {
    var _value = this.items[key];

    if (_value !== undefined) {
        return _value;
    } else {
        if (value !== undefined) {
            return value;
        } else {
            return None;
        }
    }
};

dict.PY$items = function() {
    var items = list();

    for (var key in this.items) {
        items.PY$append(tuple([key, this.items[key]]));
    }

    return items;
};

dict.PY$keys = function() {
    var keys = list();

    for (var key in this.items) {
        keys.PY$append(key);
    }

    return keys;
};

dict.PY$values = function() {
    var values = list();

    for (var key in this.items) {
        values.PY$append(this.items[key]);
    }

    return values;
};

dict.PY$update = function(other) {
   var that = this;
   iterate(other,
     function(key) {
        that.items[key] = other.PY$__getitem__(key);
     }
   );
};

dict.PY$clear = function() {
    for (var key in this.items) {
        delete this.items[key];
    }
};

dict.PY$pop = function(key, value) {
    var _value = this.items[key];

    if (_value !== undefined) {
        delete this.items[key];
    } else {
        if (value !== undefined) {
            _value = value;
        } else {
            throw py_builtins.KeyError(str(key));
        }
    }

    return _value;
};

dict.PY$popitem = function() {
    var _key;

    for (var key in this.items) {
        _key = key;
        break;
    }

    if (key !== undefined) {
        return [_key, this.items[_key]];
    } else {
        throw py_builtins.KeyError("popitem(): dictionary is empty");
    }
};
