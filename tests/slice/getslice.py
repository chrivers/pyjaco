s1 = slice(1, 10)
s2 = slice(None, 5)
s3 = slice(4, None)
s4 = slice(1, 10, 3)
s5 = slice(None, 5, 3)
s6 = slice(4, None, 3)
s7 = slice(10, 1, -3)
s8 = slice(5, None, -3)
s9 = slice(None, 4, -3)

x = range(19)

slices = [s1, s2, s3, s4, s5, s6, s7, s8, s9]

for s in slices:
    print x[s]

for s in slices:
    for l in (0, 5, 10, 19, 35):
        print s.indices(l)

for s in slices:
    print s
