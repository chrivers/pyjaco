
print "Defining Foo"

class Foo(object):

    @staticmethod
    def test():
        print 42

print "Defining Bar"

class Bar(object):

    def __init__(self, cls):
        self.cls = cls

    def test(self):
        self.cls.test()
        return self.cls

print "Creating Bar"

b = Bar(Foo)

print "Testing Bar"

print b.test() == Foo

# f = Foo()
# f.test()
# print f.__class__
# print Foo
