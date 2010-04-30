

class foobar(object):
	
	x = 1

	def __init__(self):
		self.foovar = 1

	def foo(self,x):
		self.foovar = self.foovar + x

	def bar(self):
		print self.foovar

f = foobar()
f.bar()
f.foo(1)
f.foo(2)
f.bar()
f.bar()
f.foo(-1)
f.bar()
f.foo(7)
f.bar()


