var ObjectMetaClass = function(cls) {

    this.__call__ = function() {
        var obj = new cls();
        obj.__init__.apply(obj, arguments);
        return obj;
    };

    this.__setattr__ = function(k, v) {
        this.prototype[k] = v;
    };

    this.__getattr__ = function(k) {
        return this.prototype[k];
    };

    this.__delattr__ = function(k) {
        delete this.prototype[k];
    };

    this.__repr__ = function() {
        return str.__call__("<class " + this.__name__ + ">");
    };

    this.toString = function() {
        return js(this.__repr__());
    };

    this.prototype = cls.prototype;
};

var __inherit = function(cls, name) {

    if (!defined(name)) {
        throw py_builtins.TypeError.__call__("The function __inherit must get exactly 2 arguments");
    }

    var x = function() { /* Class constructor */ };

    /* Inheritance from cls */
    for (var o in cls.prototype) {
        x.prototype[o] = cls.prototype[o];
    };

    /* Receive bacon */
    var res = new ObjectMetaClass(x);
    res.__name__ = name;
    res.prototype.__class__ = res;
    res.prototype.__super__ = cls;
    return res;
};

var __super = Function(function(scls, obj) {
    return obj.__super__;
});

var object = __inherit(function() {}, "object");

object.prototype.__init__ = function() {
};

object.prototype.__setattr__ = function(k, v) {
    this[k] = v;
};

object.prototype.__getattr__ = function(k) {
    return this[k];
};

object.prototype.__delattr__ = function(k) {
    delete this[k];
};

object.prototype.__repr__ = function() {
    return str.__call__("<instance of " + this.__class__.__name__ + ">");
};

object.prototype.__str__ = object.prototype.__repr__;

object.prototype.__ne__ = function (other) {
    return py_builtins.__not__(this.__eq__(other));
};

object.prototype.__cmp__ = function (y) {
    var g = this.__gt__(y);
    if (js(g)) {
        return 1;
    } else {
        return -js(this.__lt__(y));
    }
};

object.prototype.toString = function () {
    return js(this.__str__());
};
