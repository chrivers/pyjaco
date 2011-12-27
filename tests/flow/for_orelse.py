
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
