
g = 99

def f(a,b=1,c="default c",d=g):
	print a
	print b
	print c
	print d

f(0)
f(0,77)
f(0,77,"hello")
