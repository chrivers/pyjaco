
elm = [True, False, "foo", 100, 0, -1, 2.1, ("x", "y"), ["x", "y"], None]

for x in elm:
    for y in elm:
        print "%s > %s = %s" % (x, y, x > y)
        print "%s < %s = %s" % (x, y, x < y)
        print "%s == %s = %s" % (x, y, x == y)
        print "%s cmp %s = %s" % (x, y, cmp(x, y))
        print "  -> %s -- %s => %s" % (x.__class__.__name__, y.__class__.__name__, cmp(x.__class__.__name__, y.__class__.__name__))
