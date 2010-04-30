def ifs1(x):
    a = 1
    if x:
        a = a + 1
        a *= 2
    else:
        a = a - 1
        a *= 4
    return a

def ifs2(x):
    a = 1
    if x > 0:
        a = a + 1
        a *= 2
    else:
        a = a - 1
        a *= 4
    return a

def ifs3(x):
    a = 1
    if x > 0:
        if x > 10:
            a = 3
        else:
            a = 4
    a = 5
    return a

def ifs4(x):
    a = 1
    if x > 0:
        if x > 10:
            a = 3
        else:
            a = 4
    else:
        a = 5
    return a

print ifs1(True)
print ifs1(False)
print ifs2(1)
print ifs2(-1)
print ifs3(1)
print ifs3(20)
print ifs3(-1)
print ifs4(1)
print ifs4(20)
print ifs4(-1)
