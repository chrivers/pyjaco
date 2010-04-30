

x = 1
y = 1

def foo():
	x = 3
	x = x + 1
	print x

def bar():
	global y
	y = 3
	y = y + 1
	print y

foo()
bar()
print x
print y
