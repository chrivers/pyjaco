
class Spam(object):

	def __init__(self,value):
		self.value = value

class Eggs(object):

	def __init__(self,value):
		self.value = value

s = Spam(1)
e = Eggs(2)

if isinstance(s,Spam):
	print "s is Spam - correct"

if isinstance(s,Eggs):
	print "s is Eggs - incorrect"

if isinstance(e,Spam):
	print "e is Spam - incorrect"

if isinstance(e,Eggs):
	print "e is Eggs - correct"

