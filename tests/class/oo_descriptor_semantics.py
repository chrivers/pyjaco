class cls(object):
    x = 10

obj = cls()
print "cls:", cls.x
print "obj:", obj.x

cls.x = 20
print "cls:", cls.x
print "obj:", obj.x

obj.x = 30
print "cls:", cls.x
print "obj:", obj.x

cls.x = 40
print "cls:", cls.x
print "obj:", obj.x

del obj.x
print "cls:", cls.x
print "obj:", obj.x
