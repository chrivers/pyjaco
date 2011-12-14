
class X(object):

    def __init__(self, x = 20):
        self.x = x

    def __repr__(self):
        return "%s" % self.x

O = [X("x"), X("c"), X("y"), X("A"), X("B"), X("Z"), X("D")]
print O

L = O[:]
L.sort(key = lambda x: x.x)
print L

L = O[:]
L.sort(cmp = lambda a, b: cmp(a.x, b.x))
print L

L = O[:]
L.sort(cmp = lambda a, b: -cmp(b.x, a.x))
print L

L = O[:]
L.sort(key = lambda x: x.x.lower())
print L
