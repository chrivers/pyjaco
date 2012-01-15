print hex(42)
print hex(0)
print hex(12345678)
print hex(-100)
try:
    print hex("foo")
except TypeError, E:
    print "Failed:", E

