A = B = C = range(4)

a_count = b_count = c_count = 0

def count_a(x):
    global a_count
    a_count += 1
    return x

def count_b(x):
    global b_count
    b_count += 1
    return x

def count_c(x):
    global c_count
    c_count += 1
    return x

count = 0

for a in A:
    for b in B:
        for c in C:
            count += 1
            print count_a(a) < count_b(b) < count_c(c)
            print count_a(a) > count_b(b) > count_c(c)
            print count_a(a) <= count_b(b) <= count_c(c)
            print count_a(a) >= count_b(b) >= count_c(c)
            print count_a(a) < count_b(b) > count_c(c)
            print count_a(a) > count_b(b) < count_c(c)
            print count_a(a) <> count_b(b) == count_c(c)
            print count_a(a) == count_b(b) <> count_c(c)

print count, a_count, b_count, c_count
