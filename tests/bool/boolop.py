A = [1, 2, 3, 4, 5, 6]
B = [1, 2, 3, 4, 5, 6]
C = [1, 2, 3, 4, 5, 6]

for a in A:
    for b in B:
        for c in C:
            if a > b > c:
                print ">", (a, b, c)
            if a < b < c:
                print ">", (a, b, c)
            if a >= b >= c:
                print ">=", (a, b, c)
            if a <= b <= c:
                print "<=", (a, b, c)
