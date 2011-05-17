/* Python 'list' type */

var list = __inherit(object);

list.__name__ = 'list';
list.prototype.__class__ = list;
list.prototype.MARK = "list";

list.prototype.__init__ = function(seq) {
    if (!defined(seq)) {
        this._items = [];
        this._len = 0;
    } else {
        this._items = copy(iter.__call__(seq));
        this._len = -1;
    }
};

list.prototype.__str__ = function () {
    return str.__call__("[" + this._items.join(", ") + "]");
};

list.prototype.__eq__ = tuple.prototype.__eq__;

list.prototype.toString = tuple.prototype.toString;

list.prototype._js_ = tuple.prototype._js_;

list.prototype.__len__ = tuple.prototype.__len__;

list.prototype.__iter__ = tuple.prototype.__iter__;

list.prototype.__contains__ = tuple.prototype.__contains__;

list.prototype.__getitem__ = tuple.prototype.__getitem__;

list.prototype.__setitem__ = function(index, value) {
    if ((index >= 0) && (index < len(this)))
        this._items[index] = value;
    else if ((index < 0) && (index >= -len(this)))
        this._items[index+len(this)] = value;
    else
        throw new py_builtins.IndexError("list assignment index out of range");
};
list.prototype.__setslice__ = function(lower, upper, value) {
     var it = list.__call__(value)._items;
     if ( lower < len(this) && upper < len(this)){
       this._items = this._items.slice(0,lower).concat(it).concat(this._items.slice(upper,len(this)));
       this._len = -1;
     }
};

list.prototype.__delitem__ = function(index) {
    if ((index >= 0) && (index < len(this))) {
        var a = this._items.slice(0, index);
        var b = this._items.slice(index+1, len(this));
        this._items = a.concat(b);
        this._len = -1;
    } else
        throw new py_builtins.IndexError("list assignment index out of range");
};

list.prototype.count = tuple.prototype.count;

list.prototype.index = Function(function(value, start, end) {
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
});

list.prototype.remove = Function(function(value) {
    this.__delitem__(this.index(value));
});

list.prototype.append = Function(function(value) {
    this._items.push(value);
    this._len = -1;
});

list.prototype.extend = Function(function(l) {
    var items;
    items = this._items;
    iterate(iter.__call__(l), function(item) {
        items.push(item);
    });
    this._len = -1;
});

list.prototype.pop = Function(function() {
    if (len(this) > 0) {
        this._len = -1;
        return this._items.pop();
    } else
        throw new py_builtins.IndexError("pop from empty list");
});

list.prototype.sort = Function(function() {
    this._items.sort();
});

list.prototype.insert = Function(function(index, x) {
    var a = this._items.slice(0, index);
    var b = this._items.slice(index, len(this));
    this._items = a.concat([x], b);
    this._len = -1;
});

list.prototype.reverse = Function(function() {
    var new_list = list.__call__([]);
    iterate(iter.__call__(this), function(item) {
            new_list.insert(0, item);
    });
    this._items = new_list._items;
});
