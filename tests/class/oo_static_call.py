
class Foo(object):

    # def foo(self, x):
    #     print self
    #     return 10 + x

    @staticmethod
    def bar(x):
        return 10 + x

c = Foo()
#print c.foo(32)
print c.bar(32)
print Foo.bar(32)
