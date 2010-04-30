

class ModA:

	def __init__(self,val):
		self.val = val

	def clone(self):
		return ModA(self.val)

	def describe(self):
		print self.val
