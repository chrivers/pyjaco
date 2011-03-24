var ObjectMetaClass = function(cls) {

    this.__call__ = function() {
        obj = new cls();
        obj.__init__.apply(obj, arguments);
        return obj;
    };

    this.__setattr__ = function(k, v) {
        this.prototype[k] = v;
    };

    this.__getattr__ = function(k) {
        return this.prototype[k];
    };

    this.prototype = cls.prototype;

};

var object = function() {

    var x = function() { /* Class constructor */ };

    x.prototype.__init__ = function() {
    };

    x.prototype.__setattr__ = function(k, v) {
        this[k] = v;
    };

    x.prototype.__getattr__ = function(k) {
        return this[k];
    };

    return new ObjectMetaClass(x);
}();

var __inherit = function(cls) {

    var x = function() { /* Class constructor */ };

    /* Inheritance from cls */
    for (var o in cls.prototype) {
        x.prototype[o] = cls.prototype[o];
    };

    /* Receive bacon */
    return new ObjectMetaClass(x);
};
