def create(cls):
    return cls()

class A:
    def __init__(self):
      self.msg = "A.m()"
    def m(self):
        print self.msg

a = A()
a.m()

b = create(A)
b.m()
