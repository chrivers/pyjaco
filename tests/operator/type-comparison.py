L = [str, int, unicode, bool, list, tuple, dict]

for x in L:
    for y in L:
        print "%s == %s: %s (cmp %s)" % (x.__name__, y.__name__, x == y, cmp(x, y) in (-1, 0, 1))
