L = [str, int, unicode, bool, list, tuple, dict]

for x in L:
    for y in L:
        print "%s vs %s: %s" % (x.__name__, y.__name__, cmp(x, y))
