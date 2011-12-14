py_builtins.isinstance_orig = py_builtins.isinstance;
py_builtins.isinstance = function(obj, cls) {
    if (typeof cls.__marshall != 'undefined') {
        cls = cls.__marshall;
    };
    return py_builtins.py_builtins.isinstance_orig(obj, cls);
};

function __wrap(cls) {
    return cls;
    var wrapped_type = function() {};
    wrapped_type.prototype = cls;

    function constructor() {
        var res = new wrapped_type();
        cls.PY$__init__.apply(res, arguments);
        res.PY$__class__ = cls;
        res.PY$__construct__ = constructor;
        res.PY$__name__  = name;
        return res;
    };
    for (var o in cls) {
        constructor[o] = cls[o];
    }
    constructor.__marshall = cls;
    return constructor;
}

/** iter **/
var __orig_iter = iter;
var __iter_real__ = __wrap(iter);

iter = function(obj) {
    if (obj.PY$__class__ == __orig_iter) {
        return obj;
    } else if (defined(obj.PY$__iter__)) {
        return obj.PY$__iter__();
    } else {
        return __iter_real__.apply(null, arguments);
    }
};

/** list **/
list == __wrap(list);

/** dict **/
dict = __wrap(dict);

/** str **/
var str = __wrap(str);
var unicode = __wrap(unicode);

/** float **/
var __float_real__ = __wrap(float);

float = function(obj) {
    if (typeof obj.PY$__float__ != 'undefined') {
        return obj.PY$__float__();
    } else {
        return __float_real__.apply(null, arguments);
    }
};

/** int **/
var __int_real__ = __wrap(int);

int = function(obj) {
    if (typeof obj.PY$__int__ != 'undefined') {
        return obj.PY$__int__();
    } else {
        return __int_real__.apply(null, arguments);
    }
};
