elm = [0, 1, -1, 0.0, 1.0, -1.0]

for x in elm:
    for y in elm:
        print "%s > %s = %s" % (x, y, x > y)
        print "%s < %s = %s" % (x, y, x < y)
        print "%s == %s = %s" % (x, y, x == y)
        print "%s cmp %s = %s" % (x, y, cmp(x, y))
