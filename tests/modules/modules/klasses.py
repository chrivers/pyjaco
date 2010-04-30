
class baseklass(object):

	@staticmethod
	def sayhello():
		print "baseklass says hello"

class klass(baseklass):

	pass


if __name__ == '__main__':

	k = klass()
	k.sayhello()
	klass.sayhello()
	baseklass.sayhello()
