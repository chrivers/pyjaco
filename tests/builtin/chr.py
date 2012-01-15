print chr(42)
print chr(43)
try:
    print chr("foo")
except TypeError, E:
    print "Could not convert string:"
