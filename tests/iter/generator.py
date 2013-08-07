
class generator:

    class iterator:
        def __init__(self,parent):
            self.parent = parent
            self.value = parent.low

        def next(self):
            val = self.value
            if val > self.parent.high:
                raise StopIteration
            self.value += 1
            return val

    def __init__(self, low, high):
        self.low = low
        self.high = high

    def __iter__(self):
        return self.iterator(self)

g = generator(5,10)
for v in g:
    print v
