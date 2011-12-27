tups = [(1, 1), (1, 2), (1, 3), (1, 2, 1), (1, 2, 2), (1, 2, 10)]

for x in tups:
    for y in tups:
        print "%s cmp %s = %s" % (x, y, cmp(x, y))
        print "%s > %s = %s" % (x, y, x > y)
        print "%s < %s = %s" % (x, y, x < y)
