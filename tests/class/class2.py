class Class1(object):

    def __init__(self):
        pass

    def test1(self):
        return 5

class Class2(object):

    def test1(self):
        return 6

class Class3(object):

    def test1(self, x):
        return self.test2(x)-1

    def test2(self, x):
        return 2*x

a = Class1()
print a.test1()

a = Class2()
print a.test1()

a = Class3()
print a.test1(3)
print a.test2(3)
