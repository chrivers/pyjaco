
d = dict(a = "a", b = "b")

print d

print list(d)

print dict(d)

print dict(dict(d))

print dict(tuple([tuple(["a", "a"]), tuple(["b", "b"])]))
