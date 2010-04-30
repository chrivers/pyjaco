
a = 1.123456
b = 10
c = -30
d = 34
e = 123.456
f = 19892122

# form 0
s = "b=%i" % b
print s

# form 1
s = "b,c,d=%i+%i+%i" % (b,c,d)
print s

# form 2
s = "b=%(b)i and c=%(c)i and d=%(d)i" % { 'b':b,'c':c,'d':d }
print s

# width,flags
s = "e=%020i e=%+i e=%20i e=%-20i (e=%- 20i)" % (e,e,e,e,e)
print s
