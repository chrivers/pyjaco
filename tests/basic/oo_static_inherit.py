

class a1(object):
	
	@staticmethod
	def msg(val):
		print "a1 static method msg says:"+str(val)

class a2(a1):
	pass

a = a2()

a.msg("hello")
a2.msg("world")
