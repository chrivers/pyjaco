x = [False, 0, 0.0, [], (), dict()]
print any([])
print any(x)
print any(x + [1])

try:
    print any()
except TypeError, E:
    print "Fail", E
