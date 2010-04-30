
def foo():
	print "foo"

def moduleb_fn():
	print "import_moduleb.moduleb_fn()"

class moduleb_class(object):
	
	def __init__(self):
		pass

	def msg(self,val):
		return "moduleb_class:"+str(val)
