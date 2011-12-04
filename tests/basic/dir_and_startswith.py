
class Foo(object):

    a = 1
    b = 2
    c = 3

f = Foo()
for x in ("a", "b", "c", "d"):
    print "%s: %s" % (x, x in dir(f))

f.d = 4

for x in ("a", "b", "c", "d"):
    print "%s: %s" % (x, x in dir(f))

print filter(lambda x: not x.startswith('__'), dir(f))
print filter(lambda x: not x.endswith('__'), dir(f))
