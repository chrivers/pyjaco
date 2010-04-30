

s1 = "\n\nabc\n\n\n"
s2 = "\t abc\n\t \n"
s3 = " abc "

for s in [s1,s2,s3]:
	print "original("+s+")"
	print "strip("+s.lstrip()+")"
