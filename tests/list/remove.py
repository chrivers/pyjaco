def remove(l, e):
    try:
        l.remove(e)
        print "%s removed" % e
        print l
    except ValueError:
        print "%s not found" % e

x = [1, 1.0, True, False, None, "0", "1", "2", "3"]

remove(x, 1)
remove(x, 1)
remove(x, 1.0)
remove(x, 1.0)
remove(x, True)
remove(x, True)
remove(x, None)
remove(x, None)
remove(x, "1")
