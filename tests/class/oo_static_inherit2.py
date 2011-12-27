class Foo(object):

    x = 42

    def foo(self, a):
        print self.x, a

    @staticmethod
    def bar(a):
        print a

f = Foo()

f.foo(10)
Foo.foo(f, 10)

f.bar(20)
Foo.bar(20)
