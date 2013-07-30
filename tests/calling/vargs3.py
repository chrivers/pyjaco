def foo(a, b, c, *vargs):
    return "a=%s, b=%s, c=%s, vargs = %s" % (a, b, c, vargs)


L = ["a", "b", "c"]
print 0, foo(1, 2, 3)
print 1, foo(1, 2, 3, 4)
print 2, foo(1, 2, 3, 4, 5)
print 3, foo(*L)
print 4, foo(1, *L)
print 5, foo(1, 2, *L)
print 6, foo(1, 2, 3, *L)
print 7, foo(1, 2, 3, 4, *L)
print 8, foo(1, 2, 3, 4, 5, *L)
