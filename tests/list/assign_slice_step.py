x = range(10)
print x

x[2:10:2] = ["a", "b", "c", "d"]
print x

x = range(10)
x[2:5:1] = ["a", "b", "c", "d"]
print x

x = range(10)
x[5:2:-1] = ["a", "b", "c"]
print x
