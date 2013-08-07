
class foo(object):

    class bar(object):

        def msg(self):
            print "bar"

    class baz(bar):

        def msg(self):
            print "baz"

    def msg(self):
        print "foo"
        b = self.bar()
        b.msg()
        b = self.baz()
        b.msg()

f = foo.bar()
f.msg()
f = foo.baz()
f.msg()
f = foo()
f.msg()
