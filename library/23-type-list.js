/* Python 'list' type */

function list(seq) {
    if (arguments.length <= 1) {
        return new _list(seq);
    } else {
        throw new py_builtins.TypeError("list() takes at most 1 argument (" + arguments.length + " given)");
    }
}

function _list(seq) {
    this.__init__(seq);
}

_list.__name__ = 'list';
_list.prototype.__class__ = _list;

_list.prototype.__init__ = _tuple.prototype.__init__;

_list.prototype.__str__ = function () {
    return str("[" + this._items.join(", ") + "]");
};

_list.prototype.__eq__ = _tuple.prototype.__eq__;

_list.prototype.toString = _tuple.prototype.toString;

_list.prototype._js_ = _tuple.prototype._js_;

_list.prototype.__len__ = _tuple.prototype.__len__;

_list.prototype.__iter__ = _tuple.prototype.__iter__;

_list.prototype.__contains__ = _tuple.prototype.__contains__;

_list.prototype.__getitem__ = _tuple.prototype.__getitem__;

_list.prototype.__setitem__ = function(index, value) {
    if ((index >= 0) && (index < len(this)))
        this._items[index] = value;
    else if ((index < 0) && (index >= -len(this)))
        this._items[index+len(this)] = value;
    else
        throw new py_builtins.IndexError("list assignment index out of range");
};
_list.prototype.__setslice__ = function(lower, upper, value) {
     var it = list(value)._items;
     if ( lower < len(this) && upper < len(this)){
       this._items = this._items.slice(0,lower).concat(it).concat(this._items.slice(upper,len(this)));
       this._len = -1;
     }
};

_list.prototype.__delitem__ = function(index) {
    if ((index >= 0) && (index < len(this))) {
        var a = this._items.slice(0, index);
        var b = this._items.slice(index+1, len(this));
        this._items = a.concat(b);
        this._len = -1;
    } else
        throw new py_builtins.IndexError("list assignment index out of range");
};

_list.prototype.count = _tuple.prototype.count;

_list.prototype.index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._items[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return i;
        }

        if (defined(_value.__eq__)) {
            if (_value.__eq__(value))
                return i;
        }
    }

    throw new py_builtins.ValueError("list.index(x): x not in list");
};

_list.prototype.remove = function(value) {
    this.__delitem__(this.index(value));
};

_list.prototype.append = function(value) {
    this._items.push(value);
    this._len = -1;
};

_list.prototype.extend = function(l) {
    var items;
    items = this._items;
    iterate(iter(l), function(item) {
        items.push(item);
    });
    this._len = -1;
};

_list.prototype.pop = function() {
    if (len(this) > 0) {
        this._len = -1;
        return this._items.pop();
    } else
        throw new py_builtins.IndexError("pop from empty list");
};

_list.prototype.sort = function() {
    this._items.sort();
};

_list.prototype.insert = function(index, x) {
    var a = this._items.slice(0, index)
    var b = this._items.slice(index, len(this))
    this._items = a.concat([x], b)
    this._len = -1;
}

_list.prototype.reverse = function() {
    var new_list = list([]);
    iterate(iter(this), function(item) {
            new_list.insert(0, item);
    });
    this._items = new_list._items;
}

