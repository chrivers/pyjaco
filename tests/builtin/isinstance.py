
class A(object):
    pass

class B(A):
    pass

class C(B):
    pass

class D(C):
    pass

class X(A):
    pass

print isinstance(A(), object)
print isinstance(A(), A)
print isinstance(A(), B)
print isinstance(A(), C)
print isinstance(A(), D)

print isinstance(A(), A)
print isinstance(B(), A)
print isinstance(C(), A)
print isinstance(D(), A)

print isinstance(A(), A)
print isinstance(B(), X)

# Found, including self
print isinstance(C(), (A, B, C, D))
# Found, only second match
print isinstance(C(), (D, B))
# Found, only first match
print isinstance(C(), (B, D))
# Found, all match
print isinstance(D(), (A, B, C))
# Not found
print isinstance(C(), (D, X))
# Not found
print isinstance(A(), (B, C, D))

try:
    print isinstance(int, "foo")
except TypeError, E:
    print "Fail:", E
