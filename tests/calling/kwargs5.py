
def foo(a, b, c, d = 10):
    print a, b, c, d

foo(1, 2, 3, 4)
foo(1, 2, 3)
foo(1, 2, 3, d = 20)
foo(1, 2, c = 10, d = 20)
foo(d = 4, c = 3, b = 2, a = 1)

foo(**dict(d = 4, c = 3, b = 2, a = 1))
foo(d = 4, **dict(c = 3, b = 2, a = 1))
foo(d = 4, c = 3, **dict(b = 2, a = 1))
foo(d = 4, c = 3, b = 2, **dict(a = 1))
foo(d = 4, c = 3, b = 2, a = 1, **dict())

d = dict(d = 4, c = 3, b = 2, a = 1)
foo(**d)
