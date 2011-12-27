print [x for x in range(10)]
print [x for x in range(10) if x % 2 == 0]
print [x for x in range(10) if x % 2 == 0 if x < 7]

print [(x, x+1) for x in range(10)]

L = ["fii", "fi", "foo", "fum", "bar", "boo"]

print [x for x in L if x.startswith('fi') or x == "bar"]
