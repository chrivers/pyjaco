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
    return this;
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

_int.prototype.__mul__ = function(x) {
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

_int.prototype.__and__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    if (this._obj === 0) {
        return this;
    } else {
        return x;
    }
};

_int.prototype.__or__ = function(x) {
    if (x.__class__ !== this.__class__)
        throw py_builtins.TypeError.__call__("Cannot operate on int and non-int");
    if (this._obj === 0) {
        return x;
    } else {
        return this;
    }
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

_int.prototype.__iadd__      = _int.prototype.__add__;
_int.prototype.__isub__      = _int.prototype.__sub__;
_int.prototype.__idiv__      = _int.prototype.__div__;
_int.prototype.__imul__      = _int.prototype.__mul__;
_int.prototype.__ilshift__   = _int.prototype.__lshift__;
_int.prototype.__irshift__   = _int.prototype.__rshift__;
_int.prototype.__ior__       = _int.prototype.__or__;
_int.prototype.__iand__      = _int.prototype.__and__;
_int.prototype.__ixor__      = _int.prototype.__xor__;
_int.prototype.__ifloordiv__ = _int.prototype.__floordiv__;
_int.prototype.__ipow__      = _int.prototype.__pow__;

var $c0 = _int.__call__(0);
var $c1 = _int.__call__(1);
var $c2 = _int.__call__(2);
var $c3 = _int.__call__(3);
var $c4 = _int.__call__(4);
var $c5 = _int.__call__(5);
var $c6 = _int.__call__(6);
var $c7 = _int.__call__(7);
var $c8 = _int.__call__(8);
var $c9 = _int.__call__(9);
