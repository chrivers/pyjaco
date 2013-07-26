g = 99

def f(aaa, bbb=1, ccc="default c", ddd=g):
    print aaa
    print bbb
    print ccc
    print ddd

f(0)
f(0, 77)
f(0, 77, "hello")
