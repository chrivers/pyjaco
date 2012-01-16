x = [True, 1, 1.0, [True], (1,), dict(a = 1)]
print all([])
print all(x)
print all(x + [0])

try:
    print all()
except TypeError, E:
    print "Fail", E
