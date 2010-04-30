def f1(x):
    return x

def f2(x):
    return x + 5

def f3(x):
    a = x + 1
    return a - 5

def f3b(x):
    a = x + 1
    a -= 5
    return a

def f3c(x):
    a = float(x) + 1
    a /= 5
    return a

def f3d(x):
    a = x + 1
    a *= 5
    return a

def f3e(x):
    a = x + 1
    a += 5
    return a

def f4(x):
    if x:
        return 5
    else:
        return 6

def f5(x):
    a = 1
    if x:
        a = a + 1
    else:
        a = a - 1
    return a

print f1(3)
print f2(3)
print f3(3)
print f3b(3)
print f3c(3)
print f3d(3)
print f3e(3)
print f4(True)
print f4(False)
print f5(True)
print f5(False)
