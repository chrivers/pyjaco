from python import Python

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
    a = x + 1
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

def loop1(x):
    a = 0
    for i in range(x):
        x
        a += i
    return a

def test(func, arg_array):
    func_source = str(Python(func))
    #import dis
    #dis.dis(func)
    #print func_source
    code = compile(func_source, "", "exec")
    namespace = {}
    eval(code, {}, namespace)
    func_py = namespace[func.__name__]
    for arg in arg_array:
        assert func(arg) == func_py(arg)

def test_basic():
    test(f1, [1, 2, 3, "x"])
    test(f2, [1, 2, 3, -5])
    test(f3, [1, 2, 3, -5])
    test(f3b, [1, 2, 3, -5])
    test(f3c, [1, 2, 3, -5])
    test(f3d, [1, 2, 3, -5])
    test(f3e, [1, 2, 3, -5])
    test(f4, [True, False])
    test(f5, [True, False])

def test_ifs():
    test(ifs1, [True, False])
    test(ifs2, [-1, 1])
    test(ifs3, [-1, 1, 20])
    test(ifs4, [-1, 1, 20])

def test_loops():
    test(loop1, [-1, 1, 3, 10])

test_basic()
test_ifs()
test_loops()
