py2js.py
========

Python to JavaScript translator.

It uses Python ASTs to take any Python code and translate it to JS. The
generated JS code depends on the ``builtins.js`` library. Thanks to this clean
separation, the py2js itself is a very small script, that does a fairly direct
translation from Python to JS.

The best way to learn py2js is to take some example from the examples/
directory and start modifying it to do what you need.

Usage
-----

You can use it by decorating any function/class by the ``JavaScript``
decorator, e.g. this code::

    @JavaScript
    class TestClass(object):
        def __init__(self):
            alert('TestClass created')
            self.reset()

        def reset(self):
            self.value = 0

        def inc(self):
            alert(self.value)
            self.value += 1

    print str(TestClass)

prints::

    function TestClass() {
        return new _TestClass();
    }
    function _TestClass() {
        this.__init__();
    }
    _TestClass.__name__ = 'TestClass'
    _TestClass.prototype.__class__ = _TestClass
    _TestClass.prototype.__init__ = function() {
        alert("TestClass created");
        this.reset();
    }
    _TestClass.prototype.reset = function() {
        this.value = 0;
    }
    _TestClass.prototype.inc = function() {
        alert(this.value);
        this.value += 1;
    }

Alternatively, an equivalent way is to use ``JavaScript()`` as a function::

    class TestClass(object):
        def __init__(self):
            alert('TestClass created')
            self.reset()

        def reset(self):
            self.value = 0

        def inc(self):
            alert(self.value)
            self.value += 1

    print str(JavaScript(TestClass))

Another Example
---------------

The goal of py2js is to eventually translate any Python code. For example::

    @JavaScript
    def test():
        a = []
        for i in range(10):
            a.append(i)
        return a[3:]

translates into::

    function test() {
        a = list([]);
        var __dummy0__ = iter(range(10));
        var __dummy1__ = false;
        while (1) {
            var i;
            try {
                i = __dummy0__.next();
            } catch (__dummy2__) {
                if (isinstance(__dummy2__, py.StopIteration)) {
                    __dummy1__ = true;
                    break;
                } else {
                    throw __dummy2__;
                }
            }
            a.append(i);
        }
        return a.__getitem__(slice(3, null));
    }
