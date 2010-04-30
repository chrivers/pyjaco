
def foo(x,y):
	return x*y

y = [1,2,3,4,5]

z = reduce(foo,y,10)
print z
z = reduce(foo,y)
print z
