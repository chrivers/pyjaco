
elm = [True, False, "foo", 10, 0, -1, 2.1, ("x", "y"), ["x", "y"], None, dict(x = "y")]

for x in elm:
    for y in elm:
        print "types: %s, %s" % (x.__class__.__name__, y.__class__.__name__)
        try:
            print "%s + %s = %s" % (x, y, x + y)
        except:
            print "no __add__"

        try:
            print "%s - %s = %s" % (x, y, x - y)
        except:
            print "no __sub__"

        try:
            print "%s * %s = %s" % (x, y, x * y)
        except:
            print "no __mul__"
