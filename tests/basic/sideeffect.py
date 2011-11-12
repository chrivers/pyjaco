g = {'i': 0}

def se():
    g["i"] = g["i"] + 1
    return g["i"]

print se() and se() and se()
print g["i"]
print se() or se() or se()
print g["i"]

print se() and se() and se()
print g["i"]
print se() or se() or se()
print g["i"]

if se() and se():
    print "Quite so", se()

if se():
    print "Neat"

def foo():
    if se() and se():
        print "Quite so", se()

    if se():
        print "Neat", se()

    x = se() and se()

x = se() and se()
