
class myclass(object):

	"""This is a class that really says something"""

	def __init__(self,msg):
		self.msg = msg

	def saysomething(self):
		print self.msg
		
m = myclass("hello")

m.saysomething()
