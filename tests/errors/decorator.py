
class wrapper:

	def __init__(self,fn):
		self.fn = fn

	def __call__(self,*args):
		return "("+apply(self.fn,args)+")"

def mydecorator(x):
	print "decorating " + str(x) 
	return wrapper(x)

class myclass:

	def __init__(self,val):
		self.val = val

	@mydecorator
	def describe(self):
		return self.val

@mydecorator
def describe():
	return "world"

m = myclass("hello")
print m.describe(m)

print describe()
