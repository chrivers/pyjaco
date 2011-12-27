class A(object):

    def __init__(self):
        print self.x

class B(A):

    def __init__(self):
        self.x = 42
        super(B, self).__init__()

b = B()

