def show(o):
    """
    This tests that the proper method is called.
    """
    o.msg()

def show2(o):
    """
    This tests oo inheritance.
    """
    o.print_msg()

class A(object):

    def __init__(self):
        self._a = 5

    def msg(self):
        print "A.msg()"

    def print_msg(self):
        self.msg()
        print self._a

class B(A):

    def msg(self):
        print "B.msg()"


a = A()
show(a)
show2(a)
b = B()
show(b)
show2(b)
