
class MyException(Exception):

	def __init__(self,msg):
		self.msg = msg

	def message(self):
		return self.msg

class MyOtherException(Exception):

	def __init__(self,msg):
		self.msg = msg

	def message(self):
		return self.msg

for index in [1,2]:
	try:
		print 'raising exception...'
		if index==1:
			raise MyException('bar')
		elif index==2:
			raise MyOtherException('foo')
	except MyOtherException, ex2:
		print 'caught other exception:' + ex2.message()
	except MyException, ex:
		print 'caught exception:' + ex.message()
	finally:
		print 'and finally...'
