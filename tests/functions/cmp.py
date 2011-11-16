
class A(object):

    def __cmp__(self, obj):
        print "A"
        return 1

class B(object):


    def __cmp__(self, obj):
        print "B"
        return -1

a = A()
b = B()

print a == b
print b == a

