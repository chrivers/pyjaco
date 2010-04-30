
class foo:

	class bar:

		def msg(self):
			print "bar"

	def msg(self):
		print "foo"
		b = self.bar()
		b.msg()

f = foo.bar()
f.msg()
f = foo()
f.msg()
