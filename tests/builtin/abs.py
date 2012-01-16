print abs(2)
print abs(-2)
print abs(4.2)
print abs(-4.2)

class Foo(object):

    def __abs__(self):
        return 42

print abs(Foo())

try:
    print abs("foo")
except TypeError, E:
    print "Fail", E

try:
    print abs()
except TypeError, E:
    print "Fail", E
