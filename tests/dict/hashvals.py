d = dict()
d[True] = "true"
d[1] = "one"
d[0] = "zero"
d[False] = "false"
d[1.0] = "floatone"

print sorted(d.items())

d = dict()

d[True] = True

print 1 in d
print True in d
print 1.0 in d
print 1L in d
print 0 in d
print False in d
print "foo" in d
print "1" in d
