def mydecorator(x):

    def wrapped(self, a, b, c):
        out = x(self)
        return "(%s - %s, %s)" % (out, a+b, c)

    return wrapped

class myclass(object):
    def __init__(self,val):
        self.val = val

    @mydecorator
    def describe(self):
        return self.val

m = myclass("hello")
print m.describe(10, 5, "foo")
