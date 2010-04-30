

l = ['a','b','c']

def intest(item,list):
	if item in list:
		print str(item) + ' is in list'
	else:
		print str(item) + ' is not in list'


intest('a',l)
intest('b',l)
intest(99,l)
intest(0,l)
intest('z',l)
intest('c',l)


