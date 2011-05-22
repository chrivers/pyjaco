/* Python 'iter' type */

var iter = __inherit(object, "iter");

iter.prototype.__init__ = function(obj) {
    this._index = 0;
    if (!defined(obj)) {
        throw py_builtins.TypeError.__call__("iter() expects at least 1 argument");
    } else if (obj instanceof Array) {
        this._seq = obj;
    } else if (typeof(obj) === "string") {
        this._seq = obj.split("");
        for (var i = 0; i < this._seq.length; i++) {
            this._seq[i] = str.__call__(this._seq[i]);
        };
    } else if (obj.__class__ == iter) {
        this._seq = obj._seq;
    } else if (defined(obj.__iter__)) {
        this._seq = obj.__iter__()._seq;
    } else {
        throw py_builtins.TypeError.__call__("object is not iterable");
    }
}

iter.prototype.__str__ = function () {
    return str.__call__("<iterator of " + this._seq + " at " + this._index + ">");
};

iter.prototype.toString = function () {
    return js(this.__str__());
};

iter.prototype.next = Function(function() {
    var value = this._seq[this._index++];

    if (defined(value)) {
        return value;
    } else {
        throw py_builtins.StopIteration.__call__('no more items');
    }
});
