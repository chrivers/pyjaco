/* Python 'str' type */

var _int = __inherit(object, "int");

var __py2js_int = _int;

_int.prototype.__init__ = function(i) {
    if (arguments.length == 2) {
        this._obj = parseInt(i, arguments[1]);
    } else {
        this._obj = i;
    }
};

_int.prototype.__int__ = function () {
    return this._obj;
};

_int.prototype.__str__ = function () {
    return str.__call__(this._obj);
};

_int.prototype.toString = function () {
    return js(this.__str__());
};

_int.prototype.__repr__ = _int.prototype.__str__;

_int.prototype.__hash__ = function () {
    return this._obj;
};

_int.prototype.__eq__ = function (other) {
    if (typeof(other) === "number") {
        return bool.__call__(this._obj === other);
    }
    if (other.__class__ !== this.__class__)
        return False;
    return bool.__call__(this._obj === other._obj);
};

_int.prototype.__ne__ = function (other) {
    if (other.__class__ !== this.__class__)
        return False;
    return bool.__call__(this._obj !== other._obj);
};

_int.prototype._js_ = function () {
    return this._obj;
};

_int.prototype.__bool__ = function() {
    return py_builtins.bool(this._obj);
};

_int.prototype.__pos__ = function() {
    return _int.__call__(+this._obj);
};

_int.prototype.__neg__ = function() {
    return _int.__call__(-this._obj);
};

_int.prototype.__invert__ = function() {
    return _int.__call__(~this._obj);
};

_int.prototype.__nonzero__ = function() {
    return py_builtins.bool(this._obj != 0);
};

_int.prototype.__iadd__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot add int and non-int");
    this._obj += x._obj;
    return this;
};

_int.prototype.__isub__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot subtract int and non-int");
    this._obj -= x._obj;
    return this;
};

_int.prototype.__idiv__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot divide int and non-int");
    this._obj /= x._obj;
    return this;
};

_int.prototype.__imul__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot multiply int and non-int");
    this._obj *= x._obj;
    return this;
};

_int.prototype.__ilshift__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj <<= x._obj;
    return this;
};

_int.prototype.__irshift__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj >>= x._obj;
    return this;
};

_int.prototype.__ior__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj |= x._obj;
    return this;
};

_int.prototype.__iand__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj &= x._obj;
    return this;
};

_int.prototype.__ixor__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj ^= x._obj;
    return this;
};

_int.prototype.__ifloordiv__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj = Math.floor(this._obj / x._obj);
    return this;
};

_int.prototype.__ipow__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    this._obj = Math.pow(this._obj, x._obj);
};

_int.prototype.__imul__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot multiply int and non-int");
    this._obj *= x._obj;
    return this;
};

_int.prototype.__gt__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot compare int and non-int");
    return py_builtins.bool(this._obj > x._obj);
};

_int.prototype.__lt__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot compare int and non-int");
    return py_builtins.bool(this._obj < x._obj);
};

_int.prototype.__ge__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot compare int and non-int");
    return py_builtins.bool(this._obj >= x._obj);
};

_int.prototype.__le__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot compare int and non-int");
    return py_builtins.bool(this._obj <= x._obj);
};

_int.prototype.__mult__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot multiply int and non-int");
    return _int.__call__(this._obj * x._obj);
};

_int.prototype.__add__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot add int and non-int");
    return _int.__call__(this._obj + x._obj);
};

_int.prototype.__div__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot divide int and non-int");
    return _int.__call__(this._obj / x._obj);
};

_int.prototype.__floordiv__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(Math.floor(this._obj / x._obj));
};

_int.prototype.__sub__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot subtract int and non-int");
    return _int.__call__(this._obj - x._obj);
};

_int.prototype.__mod__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot find remainder of int and non-int");
    return _int.__call__(this._obj % x._obj);
};

_int.prototype.__pow__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot exponentiate int and non-int");
    return _int.__call__(Math.pow(this._obj, x._obj));
};

_int.prototype.__bitand__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(this._obj & x._obj);
};

_int.prototype.__bitor__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(this._obj | x._obj);
};

_int.prototype.__bitxor__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(this._obj ^ x._obj);
};

_int.prototype.__lshift__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(this._obj << x._obj);
};

_int.prototype.__rshift__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    return _int.__call__(this._obj >> x._obj);
};
