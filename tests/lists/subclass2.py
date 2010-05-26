class List(object):

    def __init__(self, l=[]):
        self._list = list(l)

    def append(self, x):
        self._list.append(x)

    def remove(self, x):
        self._list.remove(x)

    def __str__(self):
        return str(self._list)

class A(List):

    def my_append(self, a):
        self.append(a)

a = A()
print a
a.append(5)
print a
a.append(6)
print a
a.remove(5)
print a
