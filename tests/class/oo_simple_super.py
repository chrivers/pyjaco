class superclass(object):

    def test1(self):
        print "superclass"

class childclass(superclass):

    def test1(self):
        print "child"

    def test2(self):
        super(childclass, self).test1()

    def test3(self):
        self.test1()
        super(childclass, self).test1()


x = childclass()

x.test1()

x.test2()

x.test3()

