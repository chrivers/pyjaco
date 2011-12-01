
def fun1(*vargs):
    print vargs

def fun2(*vargs, **kwargs):
    print vargs, kwargs

fun1()
fun1(1,2,3)
fun1(*[1,2,3])
fun1(*[1,2,3] + [4,5,6])
l = [4,5,6]
fun1(*l + l)

for x in [dict(), dict(a = "a")]:
    fun2(**x)
    fun2(1,2,3, **x)
    fun2(*[1,2,3], **x)
    fun2(*[1,2,3] + [4,5,6], **x)
    l = [4,5,6]
    fun2(*l + l, **x)
