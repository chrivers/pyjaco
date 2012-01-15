print pow(0, 0)
print pow(1, 0)
print pow(0, 1)
print pow(1, 1)
print pow(2, -1)
print pow(100, -1)
print pow(2, 10)
try:
    print pow("foo", "bar")
except TypeError, E:
    print "Failed:", E

