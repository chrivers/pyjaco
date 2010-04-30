
def foo(x):
	return x*x

y = [1,2,3,4,5]

z = map(foo,y)
for val in z:
	print val
