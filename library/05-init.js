/* Python built-ins for JavaScript

   Useful links:

    * https://developer.mozilla.org/En/SpiderMonkey/Introduction_to_the_JavaScript_shell

*/

var py_builtins = {};

py_builtins.__python3__ = false;

/* JavaScript helper functions */

function defined(obj) {
    return typeof(obj) != 'undefined';
}

function assert(cond, msg) {
    if (!cond) {
        throw py_builtins.AssertionError.__call__(msg);
    }
}

function iterate(seq, func) {
    while (true) {
        try {
            func(seq.next());
        } catch (exc) {
            if (isinstance.__call__(exc, py_builtins.StopIteration)) {
                break;
            } else {
                throw exc;
            }
        }
    }
}

function copy(iterator) {
    var items = [];

    iterate(iterator, function(item) {
        items.push(item);
    });

    return items;
}

function copysimple(obj) {
    if (isinstance(obj, _int)) {
        return _int.__call__(Number(obj._obj));
    } else if (isinstance(obj, str)) {
        return str.__call__(String(obj._obj));
    } else {
        return obj;
    }
}

var Function = function(func) {
    func.__call__ = func;
    return func;
};

var js = Function(function(obj) {
    /*
       Converts (recursively) a Python object to a javascript builtin object.

       In particular:

       tuple -> Array
       list -> Array
       dict -> Object

       It uses the obj._js_() if it is defined, otherwise it just returns the
       same object. It is the responsibility of _js_() to convert recursively
       the object itself.
    */
    if ((obj != null) && defined(obj._js_))
        return obj._js_();
    else
        return obj;
});
