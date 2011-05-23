/* Python 'none' type */

var none = __inherit(object, "none");

none.prototype.__init__ = function(b) {
    this._obj = null;
};

var None = none.__call__();

none.__call__ = function() {
    return None;
};

var __py2jsnone = none;

none.prototype.__str__ = function () {
    return str.__call__("None");       
};

none.prototype.toString = function () {
    return "";
};

none.prototype.__repr__ = none.prototype.__str__;

none.prototype.__eq__ = function (other) {
    if (other.__class__ !== this.__class__) {
        return False;
    } else if (other === null) {
        return True;
    } else {
        return bool.__call__(this._obj === other._obj);
    }
};

none.prototype._js_ = function () {
    return this._obj;
};

none.prototype.__nonzero__ = function() {
    return False;
};

none.prototype.__and__ = function(x) {
    return None;
};

none.prototype.__or__ = function(x) {
    return x;
};
