
class generator:

	class iterator:
		def __init__(self,parent):
			self.parent = parent
			self.value = parent.min

		def next(self):
			val = self.value
			if val > self.parent.max:
				raise StopIteration
			self.value += 1
			return val

	def __init__(self,min,max):
		self.min = min
		self.max = max

	def __iter__(self):
		return self.iterator(self)

g = generator(5,10)
for v in g:
	print v
