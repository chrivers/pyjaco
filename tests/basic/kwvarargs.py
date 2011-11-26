
def foo(a, b, c):
   print a, b, c

foo(1, 2, 3)
foo(1, 2, *[3])
foo(1, *[2, 3])
foo(*[1, 2, 3])

def bar(a, b, c, *vargs):
    print a, b, c, vargs

for x in ([], [4], [4, 5], [4, 5, 6]):
    bar(1, 2, 3, *x)
    bar(1, 2, *[3] + x)
    bar(1, *[2, 3] + x)
    bar(*[1, 2, 3] + x)
    bar(*[1, 2, 3, 4, 5])

def baz(a, b, c, *vargs, **kwargs):
    print a, b, c, vargs, kwargs

for x in ([], [4], [4, 5], [4, 5, 6]):
    baz(1, 2, 3, *x, foo = "bar")
    baz(1, 2, *[3] + x, foo = "bar")
    baz(1, *[2, 3] + x, foo = "bar")
    baz(*[1, 2, 3] + x, foo = "bar")
    baz(*[1, 2, 3, 4, 5], foo = "bar")
