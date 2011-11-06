def foo(a, b = None):
    print a, b
    return a

def bar(x):
    return x

print bar(foo(17, b = "foo"))
