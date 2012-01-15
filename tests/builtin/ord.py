print ord("*")
print ord("!")
try:
    print ord("abc")
except TypeError, E:
    print "Could not convert string:", E
