counter = 10

def count():
    global counter
    counter += 1
    return counter

class Desc(object):

    def __get__(self, k, t):
        # print k, t
        print type(self) == Desc
        print k <> None
        print t == Foo
        global counter
        return lambda: count()

class Foo(object):

    d = Desc()

f = Foo()
print f.d()
print Foo.d()
