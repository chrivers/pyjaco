
class Foo(object):

    x = 42

f = Foo()
f.y = 10
f.x = 20

print f.y
print f.x
print Foo.x
