from python import Python

@Python
def test1(x):
    x = x + 1
    return x + 1

@Python
def test2(x):
    if x:
        return 5
    else:
        return 6

@Python
def test3(x):
    a = 0
    if x:
        a = 5
    else:
        a = 6
    return a

print test1
print test2
print test3
