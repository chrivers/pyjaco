def create(cls):
    return cls()

class A:
    def m(self):
        print "A.m()"

a = A()
a.m()

b = create(A)
b.m()
