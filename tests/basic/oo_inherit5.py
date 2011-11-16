class Foo(object):

    def __init__(self):
        print self.__class__.__name__

class Bar(Foo):

    pass

Foo()
Bar()
