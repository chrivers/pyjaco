def explain(msg):
    def wrap(func):
        def wrapped(x):
            print "%s: %d" % (msg, x)
            return func(x)
        return wrapped
    return wrap

def mult(mul):
    def wrap(func):
        def wrapped(x):
            return func(x*mul)
        return wrapped
    return wrap

def add(x):
    return x+1

@mult(3)
def multadd(x):
    return x+1

@explain("plus 1")
def explainadd(x):
    return x+1

@mult(3)
@explain("times 3")
def multexplainadd(x):
    return x+1

@explain("times 4")
@mult(4)
def explainmultadd(x):
    return x+1

print add(42)
print "---"
print multadd(42)
print "---"
print explainadd(42)
print "---"
print multexplainadd(42)
print "---"
print explainmultadd(42)
print "---"
