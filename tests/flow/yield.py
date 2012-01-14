
def fun():
    for x in range(10):
        yield x + 1

for x in fun():
    print x
