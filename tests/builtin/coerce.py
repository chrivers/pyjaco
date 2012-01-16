print coerce(0, 0)
print coerce(1.0, 0)
print coerce(0, 1.0)
print coerce(1.0, 1.0)

try:
    print coerce("foo", 1.0)
except TypeError, E:
    print "Fail", E

try:
    print coerce(2, "foo")
except TypeError, E:
    print "Fail", E
