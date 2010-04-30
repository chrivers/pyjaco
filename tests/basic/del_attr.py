

class spam:

	def __init__(self):
		self.eggs = 0

	def addegg(self):
		try:
			if self.eggs:
				self.eggs += 1
			else:
				self.eggs = 1
		except:
			self.eggs = 1

	def printit(self):
		try:
			if self.eggs:
				print self.eggs
			else:
				print "no eggs"
		except:
			print "no eggs"

	
s = spam()
s.addegg()
s.addegg()
s.printit()
s.addegg()
s.printit()
del s.eggs
s.printit()
s.addegg()
s.addegg()
s.printit()
