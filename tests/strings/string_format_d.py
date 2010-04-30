
a = 1.123456
b = 10
c = -30
d = 34
e = 123.456
f = 19892122

# form 0
s = "b=%d" % b
print s

# form 1
s = "b,c,d=%d+%d+%d" % (b,c,d)
print s

# form 2
s = "b=%(b)0d and c=%(c)d and d=%(d)d" % { 'b':b,'c':c,'d':d }
print s

# width,flags
s = "e=%020d e=%+d e=%20d e=%-20d (e=%- 20d)" % (e,e,e,e,e)
print s
