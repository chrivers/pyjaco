/* Python 'str' type */

function str(s) {
    return new _str(s);
}

function _str(s) {
    this.__init__(s);
}

_str.__name__ = 'str';
_str.prototype.__class__ = _str;

_str.prototype.__init__ = function(s) {
    if (!defined(s)) {
        this._obj = '';
    } else {
        if (typeof(s) === "string") {
            this._obj = s;
        } else if (defined(s.toString)) {
            this._obj = s.toString();
        } else if (defined(s.__str__)) {
            this._obj = js(s.__str__());
        } else
            this._obj = js(s);
    }
};

_str.prototype.__str__ = function () {
    return this;
};

_str.prototype.__eq__ = function (other) {
    if (other.__class__ == this.__class__) {
        if (len(this) != len(other))
            return false;
        for (var i = 0; i < len(this); i++) {
            if (this._obj[i] != other._obj[i])
                return false;
        }
        return true;
    } else
        return false;
};

_str.prototype.toString = function () {
    return js(this.__str__());
};

_str.prototype._js_ = function () {
    return this._obj;
};

_str.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._obj) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ hash(this._obj[index]);
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

_str.prototype.__len__ = function() {
    return this._obj.length;
};

_str.prototype.__iter__ = function() {
    return iter(this._obj);
};

_str.prototype.__bool__ = function() {
    return py_builtins.bool(this._obj);
};

_str.prototype.__eq__ = function(s) {
    if (typeof(s) === "string")
        return this._obj == s;
    else if (isinstance(s, _str))
        return this._obj == s._obj;
    else
        return false;
};

_str.prototype.__contains__ = function(item) {
    for (var index in this._obj) {
        if (item == this._obj[index]) {
            return true;
        }
    }

    return false;
};

_str.prototype.__getitem__ = function(index) {

    var seq;
    if (isinstance(index, _slice)) {
        var s = index;
        var inds = s.indices(len(this));
        var start = inds.__getitem__(0);
        var stop = inds.__getitem__(1);
        var step = inds.__getitem__(2);
        seq = "";
        for (var i = start; i < stop; i += step) {
            seq = seq + js(this.__getitem__(i));
        }
        return new this.__class__(seq);
    } else if ((index >= 0) && (index < len(this)))
        return this._obj[index];
    else if ((index < 0) && (index >= -len(this)))
        return this._obj[index+len(this)];
    else
        throw new py_builtins.IndexError("string index out of range");
};

_str.prototype.__setitem__ = function(index, value) {
    throw new py_builtins.TypeError("'str' object doesn't support item assignment");
};

_str.prototype.__delitem__ = function(index) {
    throw new py_builtins.TypeError("'str' object doesn't support item deletion");
};

_str.prototype.count = function(str, start, end) {
    if (!defined(start))
        start = 0;
    if (!defined(end))
        end = null;
    var count = 0;
    s = this.__getitem__(slice(start, end));
    idx = s.find(str);
    while (idx != -1) {
        count += 1;
        s = s.__getitem__(slice(idx+1, null));
        idx = s.find(str);
    }
    return count;
};

_str.prototype.index = function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = start; !defined(end) || (start < end); i++) {
        var _value = this._obj[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return i;
        }
    }

    throw new py_builtins.ValueError("substring not found");
};

_str.prototype.find = function(s) {
    return this._obj.search(s);
};

_str.prototype.rfind = function(s) {
    rev = function(s) {
        var a = list(str(s));
        a.reverse();
        a = str("").join(a);
        return a;
    }
    var a = rev(this);
    var b = rev(s);
    var r = a.find(b);
    if (r == -1)
        return r;
    return len(this)-len(b)-r
};

_str.prototype.join = function(s) {
    return str(js(s).join(js(this)));
};

_str.prototype.replace = function(old, _new, count) {
    old = js(old);
    _new = js(_new);
    var old_s;
    var new_s;

    if (defined(count))
        count = js(count);
    else
        count = -1;
    old_s = "";
    new_s = this._obj;
    while ((count != 0) && (new_s != old_s)) {
        old_s = new_s;
        new_s = new_s.replace(old, _new);
        count -= 1;
    }
    return str(new_s);
};

_str.prototype.lstrip = function(chars) {
    if (len(this) == 0)
        return this;
    if (defined(chars))
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = 0;
    while ((i < len(this)) && (chars.__contains__(this.__getitem__(i)))) {
        i += 1;
    }
    return this.__getitem__(slice(i, null));
};

_str.prototype.rstrip = function(chars) {
    if (len(this) == 0)
        return this
    if (defined(chars))
        chars = tuple(chars);
    else
        chars = tuple(["\n", "\t", " "]);
    var i = len(this)-1;
    while ((i >= 0) && (chars.__contains__(this.__getitem__(i)))) {
        i -= 1;
    }
    return this.__getitem__(slice(i+1));
};

_str.prototype.strip = function(chars) {
    return this.lstrip(chars).rstrip(chars);
};

_str.prototype.split = function(sep) {
    if (defined(sep)) {
        var r = list(this._obj.split(sep));
        var r_new = list([]);
        iterate(iter(r), function(item) {
                r_new.append(str(item));
        });
        return r_new;
    }
    else {
        var r_new = list([]);
        iterate(iter(this.split(" ")), function(item) {
                if (len(item) > 0)
                    r_new.append(item);
        });
        return r_new;
    }
};

_str.prototype.splitlines = function() {
    return this.split("\n");
};

_str.prototype.lower = function() {
    return str(this._obj.toLowerCase());
};

_str.prototype.upper = function() {
    return str(this._obj.toUpperCase());
};

