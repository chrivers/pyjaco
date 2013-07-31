def foo(a, b, c):
    print a, b, c

foo(1, 2, 3)
try:
    foo(1, 2)
except TypeError, E:
    print "Call failed"
