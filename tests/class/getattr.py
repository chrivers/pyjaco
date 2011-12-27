class Foo(object):

    def __getattr__(self, key):
        x = key.split("_")
        if len(x) > 1 and x[1] == "foo":
            return "FOO"
        else:
            return "BAR"

f = Foo()
print f.foo_foo
print f.bonk
        
