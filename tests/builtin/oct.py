print oct(42)
print oct(0)
print oct(12345678)
print oct(-100)
try:
    print oct("foo")
except TypeError, E:
    print "Failed:", E

