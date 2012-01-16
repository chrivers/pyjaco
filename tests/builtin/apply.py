
def foo(*vargs, **kwargs):
    print vargs
    for x in sorted(kwargs):
        print x, kwargs[x]

apply(foo)
apply(foo, [1, 2, 3, 4, 5])
apply(foo, [], dict(a = "a", b = "b", c = "c"))
apply(foo, [1, 2, 3, 4, 5], dict(a = "a", b = "b", c = "c"))
apply(foo, [1, 2, 3, 4, 5], dict())
apply(foo, [], dict())
apply(foo, [], dict(a = "a", b = "b", c = "c"))
