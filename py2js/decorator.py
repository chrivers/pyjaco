import py2js

import inspect 

class JavaScript(object):
    """
    Decorator that you can use to convert methods to JavaScript.

    For example this code::

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

    Alternatively, an equivalent way is to use JavaScript() as a function:

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

    If you want to call the original function/class as Python, use the
    following syntax::

        js = JavaScript(TestClass)
        test_class = js() # Python instance of TestClass() will be created
        js_class = str(js) # A string with the JS code

    """

    def __init__(self, obj):
        self._obj = obj
        obj_source = inspect.getsource(obj)
        self._js = py2js.compile(obj_source)

    def __str__(self):
        return self._js

    def __call__(self, *args, **kwargs):
        return self._obj(*args, **kwargs)

