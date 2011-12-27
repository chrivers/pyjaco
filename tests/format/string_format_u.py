
a = 1.123456
b = 10
c = -30
d = 34
e = 123.456
f = 19892122

# form 0
s = "b=%u" % b
print s

# form 1
s = "b,c,d=%u+%u+%u" % (b,c,d)
print s

# form 2
s = "b=%(b)0u and c=%(c)u and d=%(d)u" % { 'b':b,'c':c,'d':d }
print s

# width,flags
s = "e=%020u e=%+u e=%20u e=%-20u (e=%- 20u)" % (e,e,e,e,e)
print s
