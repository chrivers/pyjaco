
x = 5

def count():
    global x
    x -= 1
    return x+1

while count() > 0:
    print x

while count() > 0:
    print x
else:
    print "no iterations"
