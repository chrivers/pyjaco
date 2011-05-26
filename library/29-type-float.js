/* Python 'float' type */

var _float = __inherit(number, "float");

var __py2js_float = _float;

_float.prototype.__init__ = function(i) {
    this._obj = parseFloat(i);
};

_float.prototype._isnumeric_float = true;

_float.prototype.__float__ = function () {
    return this;
};

_float.prototype.__str__ = function () {
    if (this._obj.toString().indexOf(".") === -1) {
        return str.__call__(this._obj + ".0");
    } else {
        return str.__call__(this._obj);
    }
};

_float.prototype.__repr__ = _float.prototype.__str__;

_float.prototype.__hash__ = function () {
    return this._obj;
};

_float.prototype.__div__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot divide number and non-number");
    return _float.__call__((0.0 + this._obj) / (0.0 + x._obj));
};

_float.prototype.__pow__ = function(x) {
    if (!x._isnumeric_)
        throw py_builtins.TypeError.__call__("Cannot exponentiate number and non-number");
    return _float.__call__(Math.pow(this._obj, x._obj));
};

_float.prototype.__floordiv__ = _float.prototype.__div__;
_float.prototype.__ifloordiv__ = _float.prototype.__div__;

