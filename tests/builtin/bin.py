print bin(42)
print bin(0)
print bin(12345678)
print bin(-100)
try:
    print bin("foo")
except TypeError, E:
    print "Failed:", E

