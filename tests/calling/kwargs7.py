
def foo(x, y, **vals):
    print x, y, vals.keys(), vals.values()

foo(1, 2, z = 3)
foo(y = 2, x = 1, z = 3)
foo(x = 1, y = 2, z = 3, w = 4)
foo(1, 2)
