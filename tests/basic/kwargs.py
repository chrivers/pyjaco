
def myfunc(a,b,*c,**d):
	print a
	print b
	for i in c:
		print i
	for i in d:
		print i
		print d[i]

myfunc(1,2,bar='a',foo='c')

