
class Foo(object):

    default = 42

    def test1(self, default):
        print default

    def test2(self, default = 10):
        print default

print Foo.default
print Foo().test1(default = 21)
print Foo().test2(default = 22)
