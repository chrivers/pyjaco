print callable(2)
print callable(lambda x: x)

def foo(self):
    return 42

print callable(foo)

class Foo(object):
    pass

class Bar(object):

    def __call__(self):
        return 42

print callable(Foo)
print callable(Bar)
print callable(Foo())
print callable(Bar())

