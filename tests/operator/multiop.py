A = B = C = range(4)

for a in A:
    for b in B:
        for c in C:
            print a < b < c
            print a > b > c
            print a <= b <= c
            print a >= b >= c
            print a < b > c
            print a > b < c
