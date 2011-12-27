def dict1():
    a = {1: 3, "s": 4}
    return len(a)

def dict2():
    a = {1: 3, "s": 4}
    b = a[1] + a["s"]
    return b

def dict3():
    a = {}
    a[1] = 3
    a["s"] = 4
    b = a[1] + a["s"]
    return b

print dict1()
print dict2()
print dict3()
