x = dict()
x[1] = "1"
x["1"] = "2"

print ", ".join(sorted(["%r: %r" % item for item in x.items()]))

y = dict(x)
y[True] = "true"
y[False] = "false"

print ", ".join(sorted(["%r: %r" % item for item in y.items()]))

print y[1], y[0]
