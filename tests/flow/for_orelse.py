
for x in range(5):
    print "iterating", x
else:
    print "finishing up 1 of 2"

for x in range(0):
    print "should not happen"
else:
    print "finishing up 2 of 2"

try:
    for x in range(5):
        print "iterating", x
        if x > 3:
            raise ValueError("too high")
    else:
        print "should not happen"
except:
    pass

for x in range(2):
    for y in range(2):
        for z in range(10):
            if z == 4:
                break
        else:
            print "should not happen"
        if y == 1:
            if x == 0:
                break
    else:
        print "else 1"
else:
    print "should happen 2"
