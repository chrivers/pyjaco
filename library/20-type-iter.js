/* Python 'iter' type */

var iter = __inherit(object);

iter.prototype.MARK = "iter";

iter.prototype.__init__ = function(obj) {
    this._index = 0;
    if (!defined(obj)) {
        throw new py_builtins.TypeError("iter() expects at least 1 argument");
    } else if (obj instanceof Array) {
        this._seq = obj;
    } else if (typeof(obj) === "string") {
        this._seq = obj.split("");
    } else if (obj.__class__ == iter) {
        this._seq = obj._seq;
    } else if (defined(obj.__iter__)) {
        this._seq = obj.__iter__()._seq;
    } else {
        throw new py_builtins.TypeError("object is not iterable");
    }
}

iter.__name__ = 'iter';
iter.prototype.__class__ = iter;

iter.prototype.__str__ = function () {
    return str.__call__("<iter of " + this._seq + " at " + this._index + ">");
};

iter.prototype.toString = function () {
    return js(this.__str__());
};

iter.prototype.next = Function(function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw new py_builtins.StopIteration('no more items');
    }
});
