

s1 = "123"
s2 = "123.456"

try:
	f1 = int(s1)
	print str(f1)

	f2 = int(s2)
	print str(f2)
except ValueError, ex:
	print "conversion error"
except:
	print "unknown error"
