


class foobar(object):

	def m1(self):
		print "foobar.m1"

	def m2(self):
		print "foobar.m2"

	def m3(self):
		print "foobar.m3"

	def m4(self):
		print "foobar.m4"


class foo(foobar):

	def m2(self):
		print "foo.m2"

	def m4(self):
		print "foo.m4"

class bar(foobar):

	def m3(self):
		print "bar.m3"

class myfb(foo,bar):

	def m4(self):
		print "myfb.m4"


x = myfb()
x.m1()
x.m2()
x.m3()
x.m4()

