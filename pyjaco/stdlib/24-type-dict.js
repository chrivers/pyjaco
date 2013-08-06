/**
  Copyright 2011-2013 Christian Iversen <chrivers@iversen-net.dk>

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

dict.PY$__init__ = function(self) {
    var items;
    var key;
    var value;
    var hash;
    var count = 0;

    var pyargs = __uncook(arguments);
    var args = pyargs.varargs[0];
    if (args !== undefined) {
        if (args.PY$__class__ === dict) {
            items = {};
            for (hash in args.items) {
                value = args.items[hash];
                items[hash] = [value[0], value[1]];
                count++;
            }
        } else if (args.PY$__iter__ !== undefined) {
            items = {};
            iterate(args, function(item) {
                        var key = item.PY$__getitem__(item, $c0);
                        var hash = __builtins__.PY$hash(key);
                        if (!(hash in items)) {
                            count++;
                        }
                        items[hash] = [key, item.PY$__getitem__(item, $c1)];
            });
        } else if (args.length === undefined) {
            items = {};
            for (var item in args) {
                key = str(item);
                hash = __builtins__.PY$hash(key);
                if (!(hash in items)) {
                    count++;
                }
                items[hash] = [key, args[item]];
            };
        } else {
            items = {};
            for (var i = 0; i < args.length; i += 2)
            {
                hash = __builtins__.PY$hash(args[i]);
                if (!(hash in items)) {
                    count++;
                }
                items[hash] = [args[i], args[i+1]];
            }
        }
        self.items = items;
        self.count = count;
    } else {
        self.items = {};
        self.count = 0;
    }
    if (pyargs.kwargs !== undefined) {
        self.PY$update(self, pyargs.kwargs);
    }
    for (var p in pyargs.kw) {
        self.PY$__setitem__(self, str(p), pyargs.kw[p]);
    }
};

dict.PY$__str__ = function(self) {
    var strings = [];
    var items = self.items;

    for (var hash in items) {
        strings.push($PY.repr(items[hash][0]) + ": " + $PY.repr(items[hash][1]));
    }

    return str("{" + js(strings.join(", ")) + "}");
};

dict.PY$__repr__ = dict.PY$__str__;

dict._js_ = function(self) {
    var items = {};

    for (var hash in self.items) {
        items[str(self.items[hash][0])] = js(self.items[hash][1]);
    }

    return items;
};

dict.PY$__hash__ = function(self) {
    throw __builtins__.PY$TypeError("unhashable type: 'dict'");
};

dict.PY$__len__ = function(self) {
    return int(self.count);
};

dict.PY$__iter__ = function(self) {
    return iter(self.PY$keys());
};

dict.PY$__contains__ = function(self, key) {
    var items = self.items;
    var hash = __builtins__.PY$hash(key);
    return hash in items ? True : False;
};

dict.PY$__getitem__ = function(self, key) {
    var items = self.items;
    var hash = __builtins__.PY$hash(key);
    if (hash in items) {
        return items[hash][1];
    } else {
        throw __builtins__.PY$KeyError(str(key));
    }
    return None;
};

dict.PY$__setitem__ = function(self, key, value) {
    var items = self.items;
    var hash = __builtins__.PY$hash(key);
    if (hash in items) {
        items[hash][1] = value;
    } else {
        items[hash] = [key, value];
        self.count++;
    }
    return None;
};

dict.PY$__delitem__ = function(self, key) {
    var items = self.items;
    var hash = __builtins__.PY$hash(key);
    if (hash in items) {
        delete items[hash];
        self.count--;
    } else {
        throw __builtins__.PY$KeyError(str(key));
    }
};

dict.PY$get = function(self, key, value) {
    var items = self.items;
    var hash = __builtins__.PY$hash(key);
    if (hash in items) {
        return items[hash][1];
    } else if (value !== undefined) {
        return value;
    } else {
        return None;
    }
};

dict.PY$items = function(self) {
    var res = [];
    var items = self.items;

    for (var hash in items) {
        res.push(tuple(items[hash]));
    }

    return list(res);
};

dict.PY$keys = function(self) {
    var res = [];
    var items = self.items;

    for (var hash in items) {
        res.push(items[hash][0]);
    }

    return list(res);
};

dict.PY$values = function(self) {
    var res = [];
    var items = self.items;

    for (var hash in items) {
        res.push(items[hash][1]);
    }

    return list(res);
};

dict.PY$update = function(self, other) {
   iterate(other,
     function(key) {
         self.PY$__setitem__(self, key, other.PY$__getitem__(key));
     }
   );
};

dict.PY$clear = function(self) {
    self.items = [];
};

dict.PY$pop = function(self, key, value) {
    var items = self.items;
    var res = null;
    var hash = __builtins__.PY$hash(key);
    if (hash in items) {
        res = items[hash];
        delete items[hash];
        self.count--;
        return res[1];
    } else if (value !== undefined) {
        return value;
    } else {
        throw __builtins__.PY$KeyError(str(key));
    }
};

dict.PY$popitem = function(self) {
    var items = self.items;
    for (var hash in items) {
        var res = tuple(items[hash]);
        delete items[hash];
        self.count--;
        return res;
    }
    throw __builtins__.PY$KeyError("popitem(): dictionary is empty");
};
