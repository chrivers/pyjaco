/* Python 'dict' type */

function dict(args) {
    return new _dict(args);
}

function _dict(args) {
    this.__init__(args);
}

_dict.__name__ = 'dict';
_dict.prototype.__class__ = _dict;

_dict.prototype.__init__ = function(args) {
    var items;
    var key;
    var value;

    if (defined(args)) {
        if (defined(args.__iter__)) {
            items = {};
            iterate(iter(args), function(item) {
                    key = js(item.__getitem__(0));
                    value = item.__getitem__(1);
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

_dict.prototype.__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(js(str(key)) + ": " + js(str(this._items[key])));
    }

    return str("{" + strings.join(", ") + "}");
};

_dict.prototype.toString = function () {
    return js(this.__str__());
};

_dict.prototype._js_ = function () {
    var items = {};

    var _this_dict = this; // so that we can access it from within the closure:
    iterate(iter(this), function(key) {
        items[key] = js(_this_dict.__getitem__(key));
    });

    return items;
};

_dict.prototype.__hash__ = function () {
    throw new py_builtins.TypeError("unhashable type: 'dict'");
};

_dict.prototype.__len__ = function() {
    var count = 0;

    for (var key in this._items) {
        count += 1;
    }

    return count;
};

_dict.prototype.__iter__ = function() {
    return new _iter(this.keys());
};

_dict.prototype.__contains__ = function(key) {
    return defined(this._items[key]);
};

_dict.prototype.__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw new py_builtins.KeyError(str(key));
    }
};

_dict.prototype.__setitem__ = function(key, value) {
    this._items[key] = value;
};

_dict.prototype.__delitem__ = function(key) {
    if (this.__contains__(key)) {
        delete this._items[key];
    } else {
        throw new py_builtins.KeyError(str(key));
    }
};

_dict.prototype.get = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            return null;
        }
    }
};

_dict.prototype.items = function() {
    var items = [];

    for (var key in this._items) {
        items.push([key, this._items[key]]);
    }

    return items;
};

_dict.prototype.keys = function() {
    var keys = [];

    for (var key in this._items) {
        keys.push(key);
    }

    return keys;
};

_dict.prototype.values = function() {
    var values = [];

    for (var key in this._items) {
        values.push(this._items[key]);
    }

    return values;
};

_dict.prototype.update = function(other) {
    for (var key in other) {
        this._items[key] = other[key];
    }
};

_dict.prototype.clear = function() {
    for (var key in this._items) {
        delete this._items[key];
    }
};

_dict.prototype.pop = function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw new py_builtins.KeyError(str(key));
        }
    }

    return _value;
};

_dict.prototype.popitem = function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw new py_builtins.KeyError("popitem(): dictionary is empty");
    }
};

