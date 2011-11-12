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

dict.PY$__init__ = function(args) {
    var items;
    var key;
    var value;

    if (defined(args)) {
        if (defined(args.PY$__iter__)) {
            items = {};
            iterate(iter(args), function(item) {
                    key = item.PY$__getitem__(0);
                    value = item.PY$__getitem__(1);
                    items[key] = value;
            });
            this._items = items;
        } else if (typeof args.length === 'undefined') {
            this._items = args;
        } else {
            this._items = {};
            for (var i = 0; i < args.length / 2; i++) {
                this._items[args[i*2]] = args[i*2+1];
            }
        }
    } else {
        this._items = {};
    }
};

dict.PY$__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(str(key) + ": " + str(this._items[key]));
    }

    return str("{" + strings.join(", ") + "}");
};

dict._js_ = function () {
    var items = {};

    var that = this; // so that we can access it from within the closure:
    iterate(iter(this), function(key) {
        items[key] = js(that.PY$__getitem__(key));
    });

    return items;
};

dict.PY$__hash__ = function () {
    throw py_builtins.TypeError("unhashable type: 'dict'");
};

dict.PY$__len__ = function() {
    var count = 0;

    for (var key in this._items)
        count += 1;

    return int(count);
};

dict.PY$__iter__ = function() {
    return iter(this.PY$keys());
};

dict.PY$__contains__ = function(key) {
    return bool(defined(this._items[key]));
};

dict.PY$__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw py_builtins.KeyError(str(key));
    }
};

dict.PY$__setitem__ = function(key, value) {
    this._items[key] = value;
};

dict.PY$__delitem__ = function(key) {
    if (js(this.PY$__contains__(key))) {
        delete this._items[key];
    } else {
        throw py_builtins.KeyError(str(key));
    }
};

dict.PY$get = function(key, value) {
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
};

dict.PY$items = function() {
    var items = list();

    for (var key in this._items) {
        items.PY$append(tuple([key, this._items[key]]));
    }

    return items;
};

dict.PY$keys = function() {
    var keys = list();

    for (var key in this._items) {
        keys.PY$append(key);
    }

    return keys;
};

dict.PY$values = function() {
    var values = list();

    for (var key in this._items) {
        values.PY$append(this._items[key]);
    }

    return values;
};

dict.PY$update = function(other) {
   var that = this;
   iterate(iter(other),
     function(key) {
        that._items[key] = other.PY$__getitem__(key);
     }
   );
};

dict.PY$clear = function() {
    for (var key in this._items) {
        delete this._items[key];
    }
};

dict.PY$pop = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw py_builtins.KeyError(str(key));
        }
    }

    return _value;
};

dict.PY$popitem = function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw py_builtins.KeyError("popitem(): dictionary is empty");
    }
};
