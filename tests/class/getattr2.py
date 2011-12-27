class Foo(object):

    def __getattr__(self, key):
        print "In __getattr__"
        return 1

    __foo__ = "42"

f = Foo()
print f.__foo__
print f.bar
