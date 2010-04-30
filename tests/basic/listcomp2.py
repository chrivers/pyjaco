
for (x,y,z) in [(x,y,z) for x in xrange(0,3) for y in xrange(0,4) for z in xrange(0,5)]:
	if x < y < z: 
		print x,y,z,"x<y<z"


