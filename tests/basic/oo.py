
class foo(object):
	
	registered = []

	def __init__(self,val):
		self.fval = val
		self.register(self)

	def inc(self):
		self.fval += 1

	def msg(self):
		return "foo says:"+str(self.fval)

	@staticmethod
	def register(f):
		foo.registered.append(f)

	@staticmethod
	def printregistered():
		for r in foo.registered:
			print r.msg()

a = foo(10)
b = foo(20)
c = foo(30)

a.inc()
a.inc()
c.inc()

print a.msg()
print b.msg()
print c.msg()

print "---"

foo.printregistered()
