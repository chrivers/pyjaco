a = "well"
b = "seems to work"
c = "something else"

# form 0
s = "b=%s" % a
print s

# form 1
s = "b,c,d=%s+%s+%s" % (a, b, c)
print s
