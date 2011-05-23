/* Python 'tuple' type */

var tuple = __inherit(object, "tuple");

tuple.prototype.__init__ = function(seq) {

    if (arguments.length > 1) {
        throw py_builtins.TypeError.__call__("tuple() takes at most 1 argument (" + arguments.length + " given)");
    } else if (!defined(seq)) {
        this._items = [];
        this._len = 0;
    } else {
        this._items = copy(iter.__call__(seq));
        this._len = -1;
    }
};

tuple.prototype.__str__ = function () {
    if (this.__len__() == 0) {
        return str.__call__("()");
    } else if (this.__len__() == 1) {
        return str.__call__("(" + str.__call__(this._items[0]) + ",)");
    } else {
        var items = map(function (i) {return str.__call__(i);}, this._items);
        return str.__call__("(" + str.__call__(", ").join(items) + ")");
    }
};

tuple.prototype.__repr__ = tuple.prototype.__str__;

tuple.prototype.__eq__ = function (other) {
    if (other.__class__ == this.__class__) {
        if (len(this) != len(other))
            return false;
        for (var i = 0; i < len(this); i++) {
            // TODO: use __eq__ here as well:
            if (this._items[i] != other._items[i])
                return false;
        }
        return true;
        // This doesn't take into account hash collisions:
        //return hash(this) == hash(other)
    } else
        return false;
};

tuple.prototype.toString = function () {
    return js(this.__str__());
};

tuple.prototype._js_ = function () {
    var items = [];

    iterate(iter.__call__(this), function(item) {
        items.push(js(item));
    });

    return items;
};

tuple.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._items) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._items[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

tuple.prototype.__len__ = function() {
    if (this._len == -1) {
        var count = 0;

        for (var index in this._items) {
            count += 1;
        }

        this._len = count;
        return count;
    } else
        return this._len;
};

tuple.prototype.__iter__ = function() {
    return iter.__call__(this._items);
};

tuple.prototype.__contains__ = function(item) {
    for (var index in this._items) {
        if (py_builtins.eq(item, this._items[index])) {
            return true;
        }
    }

    return false;
};

tuple.prototype.__getitem__ = function(index) {
    var seq;
    if (isinstance.__call__(index, slice)) {
        var s = index;
        var inds = s.indices(len(this));
        var start = inds.__getitem__(0);
        var stop = inds.__getitem__(1);
        var step = inds.__getitem__(2);
        seq = [];
        for (var i = start; i < stop; i += step) {
            seq.push(this.__getitem__(i));
        }
        return this.__class__.__call__(seq);
    } else if ((index >= 0) && (index < len(this)))
        return this._items[index];
    else if ((index < 0) && (index >= -len(this)))
        return this._items[index+len(this)];
    else
        throw py_builtins.IndexError.__call__("list assignment index out of range");
};

tuple.prototype.__setitem__ = function(index, value) {
    throw py_builtins.TypeError.__call__("'tuple' object doesn't support item assignment");
};

tuple.prototype.__delitem__ = function(index) {
    throw py_builtins.TypeError.__call__("'tuple' object doesn't support item deletion");
};

tuple.prototype.count = Function(function(value) {
    var count = 0;

    for (var index in this._items) {
        if (value == this._items[index]) {
            count += 1;
        }
    }

    return count;
});

tuple.prototype.index = Function(function(value, start, end) {
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
    }

    throw py_builtins.ValueError.__call__("tuple.index(x): x not in list");
});

