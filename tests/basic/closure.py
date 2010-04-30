
def factory(x):

	def fn():
		return x
	
	return fn

a1 = factory("foo")
a2 = factory("bar")
print a1()
print a2()
