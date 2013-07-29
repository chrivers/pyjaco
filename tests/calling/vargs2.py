
def test0(*varargs):
    print varargs

class foo(object):

    def test1(self, *varargs):
        print varargs

    @staticmethod
    def test2(*varargs):
        print varargs

c = foo()
test0(2,3,4,5)
c.test1(2,3,4,5)
c.test2(2,3,4,5)
