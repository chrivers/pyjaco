
n = [5, 5.0, 2, 0, 0.1]

for x in n:
    for y in n:
        try:
            print "%s / %s = %s" % (x, y, x / y)
        except ZeroDivisionError:
            print "Oops, divided by 0: (%d / %d)" % (x, y)
        print "%s + %s = %.5f" % (x, y, x + y)
        print "%s - %s = %.5f" % (x, y, x - y)
        print "%s * %s = %.5f" % (x, y, x * y)
        print "%s ** %s = %.5f" % (x, y, x ** y)

print "Finished"

