def show(val):
    print "----"
    for x in val:
        print x

x = range(19)
x[2:10:2] = ["a", "b", "c", "d"]
show(x)

x = range(19)
x[2:5:1] = ["a", "b", "c", "d"]
show(x)

x = range(19)
x[5:2:-1] = ["a", "b", "c"]
show(x)

x = range(19)
x[5:2:-1] = ["a", "b", "c"]
show(x)

x = range(19)
x[:7:-4] = ["a", "b", "c"]
show(x)

try:
    x = range(19)
    x[::-4] = ["a", "b", "c"]
    show(x)
except ValueError, E:
    print E
