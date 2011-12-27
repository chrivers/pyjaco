def myfunc(a, b = 42, c = 10, *d, **e):
    print a
    print b
    print c
    for i in d:
        print i
    keys = e.keys()
    keys.sort()
    for i in keys:
        print i
        print e[i]

myfunc(1, 2, bar='a', foo='c')
print "----"
myfunc(1, 2, 3, 4, bar='a', foo='c')
print "----"
myfunc(1, bar='a', foo='c')
print "----"
myfunc(1, 2, 3, 4, 5, 6, 7, 8)
