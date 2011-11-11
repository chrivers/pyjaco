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

dict.PY$__init__ = function(args) {
    var items;
    var key;
    var value;

    if (defined(args)) {
        if (defined(args.PY$__iter__)) {
            items = {};
            iterate(iter.PY$__call__(args), function(item) {
                    key = js(item.PY$__getitem__(0));
                    value = item.PY$__getitem__(1);
                    items[key] = value;
            });
            this._items = items;
        }
        else
            this._items = args;
    } else {
        this._items = {};
    }
};

dict.PY$__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(js(str.PY$__call__(key)) + ": " + js(str.PY$__call__(this._items[key])));
    }

    return str.PY$__call__("{" + strings.join(", ") + "}");
};

dict._js_ = function () {
    var items = {};

    var _this_dict = this; // so that we can access it from within the closure:
    iterate(iter.PY$__call__(this), function(key) {
        items[js(key)] = js(_this_dict.__getitem__(key));
    });

    return items;
};

dict.PY$__hash__ = function () {
    throw py_builtins.TypeError.PY$__call__("unhashable type: 'dict'");
};

dict.PY$__len__ = function() {
    var count = 0;

    for (var key in this._items)
        count += 1;

    return _int.PY$__call__(count);
};

dict.PY$__iter__ = function() {
    return iter.PY$__call__(this.PY$keys());
};

dict.PY$__contains__ = function(key) {
    return bool.PY$__call__(defined(this._items[key]));
};

dict.PY$__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw py_builtins.KeyError.PY$__call__(str.PY$__call__(key));
    }
};

dict.PY$__setitem__ = function(key, value) {
    this._items[key] = value;
};

dict.PY$__delitem__ = function(key) {
    if (js(this.PY$__contains__(key))) {
        delete this._items[key];
    } else {
        throw py_builtins.KeyError.PY$__call__(str.PY$__call__(key));
    }
};

dict.PY$get = Function(function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            return None;
        }
    }
});

dict.PY$items = Function(function() {
    var items = list.PY$__call__();

    for (var key in this._items) {
        items.append(tuple.PY$__call__([key, this._items[key]]));
    }

    return items;
});

dict.PY$keys = Function(function() {
    var keys = list.PY$__call__();

    for (var key in this._items) {
        keys.PY$append(key);
    }

    return keys;
});

dict.PY$values = Function(function() {
    var values = list.PY$__call__();

    for (var key in this._items) {
        values.append(this._items[key]);
    }

    return values;
});

dict.PY$update = Function(function(other) {
   var _this = this;
   iterate(iter.PY$__call__(other),
     function(key) {
        _this._items[js(key)] = other.__getitem__(key);
     }
   );
});

dict.PY$clear = Function(function() {
    for (var key in this._items) {
        delete this._items[key];
    }
});

dict.PY$pop = Function(function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw py_builtins.KeyError.PY$__call__(str.PY$__call__(key));
        }
    }

    return _value;
});

dict.PY$popitem = Function(function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw py_builtins.KeyError.PY$__call__("popitem(): dictionary is empty");
    }
});
