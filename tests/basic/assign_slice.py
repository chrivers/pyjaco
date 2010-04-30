
a = [1,2,3,4,5,6,7]

a[4:6] = ['a','b']

def show(x):
	print "----"
	for x in a:
		print x

show(a)


a[2:4] = ['z']

show(a)

a[0:2] = ['abc','def','abc','def']

show(a)
