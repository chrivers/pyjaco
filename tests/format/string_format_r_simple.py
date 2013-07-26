a = "well"
b = "seems to work"
c = "something else"

# form 0
s = "b=%r" % a
print s

# form 1
s = "b,c,d=%r+%r+%r" % (a, b, c)
print s
