def myfunc(a, b, *c, **d):
    print a
    print b
    for i in c:
        print i
    keys = d.keys()
    keys.sort()
    for i in keys:
        print i
        print d[i]

myfunc(1, 2, bar='a', foo='c')
print
myfunc(1, 2, 3, 4, bar='a', foo='c')
