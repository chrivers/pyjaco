class A(object):
    def met(self):
        print 'A.met'
class B(A):
    def met(self):
        print 'B.met'
        super(B,self).met( )
class C(A):
    def met(self):
        print 'C.met'
        super(C,self).met( )
class D(B,C):
    def met(self):
        print 'D.met'
        super(D,self).met( )

D().met()
