x = [1, True, "foo", "bar"]

print x.pop() == "bar"
print x.pop() == "foo"
print x.pop() == True
print x.pop() == 1

x = [1, True, "foo", "bar"]

print x.pop(0) == 1
print x.pop(0) == True
print x.pop(0) == "foo"
print x.pop(0) == "bar"

try:
    x.pop()
except IndexError, E:
    print "Done:", E

x = [1, 2, 3]

try:
    x.pop(4)
except IndexError, E:
    print "Done:", E
