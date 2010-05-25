class List(object):

    def __init__(self, l=[]):
        self._list = list(l)

    def append(self, x):
        self._list.append(x)

    def remove(self, x):
        self._list.remove(x)

    def __str__(self):
        return str(self._list)

class Layer(List):
    pass

l1 = Layer()
l1.append(1)
l1.append(2)
l2 = list()
l2.append(3)
l2.append(4)
print l1
print l2
