class Foo(object):

    var = "Foo"

    def bar():
        return "Bar"

f = Foo()
Foo.bar = lambda self: self.var + "Bar"

print f.bar()
