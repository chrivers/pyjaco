x = dict()
x[1] = "1"
x["1"] = "2"

print x

y = dict(x)
y[True] = "true"
y[False] = "false"

print y

print y[1], y[0]
