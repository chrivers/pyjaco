

l1 = [1,2,3,4,5]
l2 = [5,4,3,2,1]
l3 = [4,4,4,4]

l4 = zip(l1,l2,l3)

for item in l4:
	print "---"
	for val in item:
		print val
