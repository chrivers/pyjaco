function object(){
    /* object constructor */
}

object.__name__ = 'object';

object.prototype.__class__ = object;

object.prototype.__mro__ = [];

object.prototype.__inherited__ = {};

object.prototype.__init__ = function() {
    /* object constructor */
};

object.prototype.__getattr__ = function (key) {
    return this[key];
};

object.prototype.__setattr__ = function (key, value) {
    this[key] = value;
};

var extend = function(cls, base_list) {
    var _mro = mro(cls,base_list);
    cls.prototype.__mro__ = _mro;
    //properties not defined in the original definition
    cls.prototype.__inherited__ = {};
    for (var i = 1; i < _mro.length; i++){
        base = _mro[i];
        for(var property in base.prototype){
            if(!(property in cls.prototype) && !(property in base.prototype.__inherited__)){
                cls.prototype[property] = base.prototype[property];
                cls.prototype.__inherited__[property] = base.prototype[property];
            }
        }
    }
    //static properties not defined in the original definition
    cls.__inherited__ = {};
    for (var i = 1; i < _mro.length; i++){
        base = _mro[i];
        for(var property in base){
            if(!(property in cls) && !(property in base.__inherited__)){
                cls[property] = base[property];
                cls.__inherited__[property] = base[property];
            }
        }
    }
}

var mro = function(cls, base_list) {
    var order = [];
    if (cls === object) {
        return [object];
    }else if(base_list.length === 1 && base_list[0]===object) {
        return [cls, object];
    }
    
    var orderlists = [];
    for (var i = 0; i < base_list.length; i++){
        orderlists[i] = base_list[i].prototype.__mro__.slice(0);
    }
    orderlists[orderlists.length] = [cls].concat(base_list);
    while (orderlists.length > 0) {
        candidate_found = false;
        for (var i = 0; i < orderlists.length; i++){
            candidatelist = orderlists[i]
            candidate = candidatelist[0];
            if(mro_not_blocking(candidate,orderlists)){
                /**good candidate */
                candidate_found = true;
                break;
                }
            }
        if(!candidate_found || order.indexOf(candidate)>-1){
            throw Exception;
            }
        order[order.length] = candidate;
        for (var i = orderlists.length-1; i >= 0; i--){
            if(orderlists[i][0] === candidate){
                orderlists[i].splice(0,1);
                if(orderlists[i].length === 0){
                    orderlists.splice(i,1);
                    }
                }
            }
        }
    return order;
}

var mro_not_blocking = function(candidate, orderlists) {
    for(var j = 0; j < orderlists.length; j++){
        if(orderlists[j].indexOf(candidate)>0){
            return false;
            }
        }
        return true;
}

var _super = function(cls,instance){
    super_instance = {};
    _mro = instance.__mro__;
    cls_name = cls.__name__;
    function make_caller(base, property){
        var f = function(){
            base.prototype[property].apply(instance,arguments);
        }
        return f;
    }

    var k = 0;
    while((_mro[k].__name__ !== cls_name) && k<_mro.length){
        k = k + 1;
    }
    if(k === _mro.length){
        cls_name = cls.__name__;
        throw new py_builtins.AttributeError(instance, cls_name);}
    k = k + 1;
    for (var i = k; i < _mro.length; i++){
        base = _mro[i];
        for(var property in base.prototype){
            if(!(property in super_instance)){
                try{
                    super_instance[property] = make_caller(base,property);
                }catch(e){
                    super_instance[property] = base.prototype[property];
                }
                }
        }
    }
    //TODO: super of static methods and class attributes
    return super_instance;
}

