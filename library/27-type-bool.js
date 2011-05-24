/* Python 'bool' type */

var bool = __inherit(object, "bool");

bool.prototype.__init__ = function(b) {
    if (b) {
        this._obj = true;
    } else {
        this._obj = false;
    }
};

var True = bool.__call__(true);
var False = bool.__call__(false);

bool.__call__ = function(b) {
    if (b) {
        return True;
    } else {
        return False;
    }
};

var __py2jsbool = bool;

bool.prototype.__bool__ = function () {
    return this._obj;
};

bool.prototype.__str__ = function () {
    if (this._obj) {
        return str.__call__("True");
    } else {
        return str.__call__("False");
    }
};

bool.prototype.toString = function () {
    if (this._obj) {
        return "1";
    } else {
        return "";
    }
};

bool.prototype.__repr__ = bool.prototype.__str__;

bool.prototype.__eq__ = function (other) {
    if (other.__class__ !== this.__class__)
        return False;

    return bool.__call__(this._obj === other._obj);
};

bool.prototype._js_ = function () {
    return this._obj;
};

bool.prototype.__neg__ = function() {
    return bool.__call__(!this._obj);
};

bool.prototype.__nonzero__ = function() {
    return bool.__call__(this._obj);
};

bool.prototype.__and__ = function(x) {
    if (this._obj) {
        return x;
    } else {
        return this;
    }
};

bool.prototype.__or__ = function(x) {
    if (this._obj) {
        return this;
    } else {
        return x;
    }
};
