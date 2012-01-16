print type(42) == int
print type("foo") is str

class Foo(object):
    pass

f = Foo()
print type(f) == Foo
print type(f) is Foo
