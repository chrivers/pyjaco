x = 1
y = 2

def f1():
    x, y = 3, 4
    print [x, y]

def f2():
    global y
    x, y = 5, 6
    print [x, y]

def f3():
    global x
    x, y = 7, 8
    print [x, y]

def f4():
    global x, y
    x, y = 9, 10
    print [x, y]

print [x, y]
f1()
print [x, y]
f2()
print [x, y]
f3()
print [x, y]
f4()
print [x, y]
