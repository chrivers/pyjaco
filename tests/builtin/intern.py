intern("")
intern("foo")
try:
    intern(42)
except TypeError, E:
    print "Failed:", E
