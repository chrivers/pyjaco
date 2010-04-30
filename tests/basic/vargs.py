
def myfunc(a,b,*c):
	print a
	print b
	for i in c:
		print i

myfunc(1,2)
myfunc('a','b','c','d')
myfunc(3,4,5,6,'hello')

