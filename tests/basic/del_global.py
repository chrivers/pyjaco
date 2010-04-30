
x = 1

def foo():
	global x
	del x

print x

foo()

try:
	print x
except:
	print "x is gone"
