
class spam:

	def __init__(self):
		self.msgtxt = "this is spam"

	def msg(self):
		print self.msgtxt

if __name__ == '__main__':
	s = spam()
	s.msg()
