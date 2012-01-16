
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

print issubclass(A, object)
print issubclass(A, A)
print issubclass(A, B)
print issubclass(A, C)
print issubclass(A, D)

print issubclass(A, A)
print issubclass(B, A)
print issubclass(C, A)
print issubclass(D, A)

print issubclass(A, A)
print issubclass(B, X)

# Found, including self
print issubclass(C, (A, B, C, D))
# Found, only second match
print issubclass(C, (D, B))
# Found, only first match
print issubclass(C, (B, D))
# Found, all match
print issubclass(D, (A, B, C))
# Not found
print issubclass(C, (D, X))
# Not found
print issubclass(A, (B, C, D))

try:
    print issubclass(int, "foo")
except TypeError, E:
    print "Fail:", E
