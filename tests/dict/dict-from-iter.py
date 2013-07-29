class Foo(object):

    def __init__(self):
        self.values = [1, "one", 2, "two", 3, "three"]

    def __iter__(self):
        return self

    def next(self):
        if self.values:
            key = self.values.pop(0)
            value = self.values.pop(0)
            print key, value            
            return key, value
        else:
            raise StopIteration()

f = Foo()
d = dict(f)
print d
print sorted(d.items())
print len(d)
