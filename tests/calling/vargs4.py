class UserType(object):

    def __init__(self, val):
        self.x = val

    def __str__(self):
        return "<usertype with value %d>" % self.x

def foo(a, b, *vargs):
    print a, b, repr(vargs)

foo(1, 2)
foo(1, 2, 3)
foo(1, 2, 3, 4)
foo(UserType(1), UserType(2))
foo(UserType(1), UserType(2), UserType(3))
foo(UserType(1), UserType(2), UserType(3), UserType(4))
