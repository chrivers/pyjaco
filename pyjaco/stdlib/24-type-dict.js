/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
  Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
  Copyright 2011 Christian Iversen <ci@sikkerhed.org>

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
**/

var dict = __inherit(object, "dict");

__builtins__.PY$dict = dict;

dict.PY$__init__ = function() {
    var items;
    var key;
    var value;

    var kwargs = __kwargs_get(arguments);
    var args = arguments[0];
    if (args !== undefined) {
        if (args.PY$__class__ === dict) {
            items = args.items.slice();
        } else if (args.PY$__iter__ !== undefined) {
            items = [];
            iterate(args, function(item) {
                        items.push(item.PY$__getitem__($c0));
                        items.push(item.PY$__getitem__($c1));
            });
        } else if (args.length === undefined) {
            items = [];
            for (var item in args) {
                items.push(str(item));
                items.push(args[item]);
            };
        } else {
            items = args.slice();
        }
        this.items = items;
    } else {
        this.items = [];
    }
    for (var p in kwargs) {
        this.PY$__setitem__(str(p), kwargs[p]);
    }
};

dict.PY$__str__ = function () {
    var strings = [];
    var items = this.items;

    for (var i = 0; i < items.length; i += 2) {
        strings.push($PY.repr(items[i]) + ": " + $PY.repr(items[i+1]));
    }

    return str("{" + js(strings.join(", ")) + "}");
};

dict.PY$__repr__ = dict.PY$__str__;

dict._js_ = function () {
    var items = {};

    for (var i = 0; i < this.items.length; i += 2) {
        items[str(this.items[i])] = js(this.items[i+1]);
    }

    return items;
};

dict.PY$__hash__ = function () {
    throw __builtins__.PY$TypeError("unhashable type: 'dict'");
};

dict.PY$__len__ = function() {
    return int(this.items.length / 2);
};

dict.PY$__iter__ = function() {
    return iter(this.PY$keys());
};

dict.PY$__contains__ = function(key) {
    var items = this.items;
    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            return True;
        }
    }
    return False;
};

dict.PY$__getitem__ = function(key) {
    var items = this.items;

    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            return items[i+1];
        }
    }
    throw __builtins__.PY$KeyError(str(key));
};

dict.PY$__setitem__ = function(key, value) {
    var items = this.items;
    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            items[i+1] = value;
            return;
        }
    }
    items.push(key);
    items.push(value);
};

dict.PY$__delitem__ = function(key) {
    var items = this.items;
    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            this.items = items.slice(0, i).concat(items.slice(i+2));
            return;
        }
    }
    throw __builtins__.PY$KeyError(str(key));
};

dict.PY$get = function(key, value) {
    var items = this.items;

    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            return items[i+1];
        }
    }
    if (value !== undefined) {
        return value;
    } else {
        return None;
    }
};

dict.PY$items = function() {
    var res = [];
    var items = this.items;
    for (var i = 0; i < items.length; i += 2) {
        res.push(tuple([items[i], items[i+1]]));
    }

    return list(res);
};

dict.PY$keys = function() {
    var res = [];
    var items = this.items;

    for (var i = 0; i < this.items.length; i += 2) {
        res.push(items[i]);
    }

    return list(res);
};

dict.PY$values = function() {
    var res = [];
    var items = this.items;

    for (var i = 1; i < items.length; i += 2) {
        res.push(items[i]);
    }

    return list(res);
};

dict.PY$update = function(other) {
   var self = this;
   iterate(other,
     function(key) {
         self.PY$__setitem__(key, other.PY$__getitem__(key));
     }
   );
};

dict.PY$clear = function() {
    this.items = [];
};

dict.PY$pop = function(key, value) {
    var items = this.items;
    var res = null;

    for (var i = 0; i < items.length; i += 2) {
        if (items[i].PY$__eq__(key) === True) {
            res = items[i+1];
            this.items = items.slice(0, i).concat(items.slice(i+2));
        }
    }
    if (res !== null) {
        return res;
    } else if (value !== undefined) {
        return value;
    } else {
        throw __builtins__.PY$KeyError(str(key));
    }
};

dict.PY$popitem = function() {
    var items = this.items;
    if (items.length > 1) {
        var item = items.pop();
        var key = items.pop();
        return tuple([key, value]);
    } else {
        throw __builtins__.PY$KeyError("popitem(): dictionary is empty");
    }
};
