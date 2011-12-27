def tuple1(x):
    t = (x, x+1, x+2)
    a, b, c = t
    return a+b+c

def tuple2(n):
    a = 0
    for i in (1, 2, n):
        a += i
    return a

def tuple3():
    a = (1, 3, 5, 4, 9, 1, 2, 3)
    return len(a)

def tuple4(n):
    a = (1, 3, 3, 4, 9, 1, 2, 3)
    return a.count(n)

def tuple5(n):
    a = (1, 3, 3, 4, 9, 1, 2, 3)
    return a.index(n)

def tuple6():
    a = (8, 9, 10, 11, 12, 13, 14)
    return a[2:4]

def tuple7():
    a = (8, 9, 10, 11, 12, 13, 14)
    return a[:4]

def tuple8():
    a = (8, 9, 10, 11, 12, 13, 14)
    return a[1:6:2]

def tuple9():
    a = (8, 9, 10, 11, 12, 13, 14)
    return a[:]

def tuple10():
    a = (8, 9, 10, 11, 12, 13, 14)
    return a[4:]


print tuple1(3)
print tuple2(3)
print tuple2(4)
print tuple3()
print tuple4(1)
print tuple4(3)
print tuple4(4)
print tuple4(5)
print tuple5(1)
print tuple5(4)
print tuple6()
print tuple7()
print tuple8()
print tuple9()
print tuple10()
