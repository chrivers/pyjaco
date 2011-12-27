a = 1.123456
b = 10
c = -30
d = 34
e = 123.456789
f = 892122.129899

# form 0
s = "b=%f" % a
print s

# form 1
s = "b,c,d=%f+%f+%f" % (a, e, f)
print s
