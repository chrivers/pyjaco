
s1 = "hello"
s2 = "world"
s3 = "abcd"

s4 = zip(s1,s2,s3)

for item in s4:
	print "----"
	for val in item:
		print val
