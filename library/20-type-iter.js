/* Python 'iter' type */

function iter(obj) {
    if (obj instanceof Array) {
        return new _iter(obj);
    } else if (typeof(obj) === "string") {
        return iter(obj.split(""));
    } else if (obj.__class__ == _iter) {
        return obj;
    } else if (defined(obj.__iter__)) {
        return obj.__iter__();
    } else {
        throw new py_builtins.TypeError("object is not iterable");
    }
}

function _iter(seq) {
    this.__init__(seq);
}

_iter.__name__ = 'iter';
_iter.prototype.__class__ = _iter;

_iter.prototype.__init__ = function(seq) {
    this._seq = seq;
    this._index = 0;
};

_iter.prototype.__str__ = function () {
    return str("<iter of " + this._seq + " at " + this._index + ">");
};

_iter.prototype.toString = function () {
    return js(this.__str__());
};

_iter.prototype.next = function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw new py_builtins.StopIteration('no more items');
    }
};

