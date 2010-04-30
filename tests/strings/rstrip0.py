

s1 = "abc\n\n\n"
s2 = "abc\n\t \n"
s3 = "abc "

for s in [s1,s2,s3]:
	print "original("+s+")"
	print "strip("+s.rstrip()+")"
