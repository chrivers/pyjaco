def explain(func):
    def wrapped(x):
        print "We got %d" % x
        return func(x)
    return wrapped

def double(func):
    def wrapped(x):
        return func(x*2)
    return wrapped

def add(x):
    return x+1

@double
def doubleadd(x):
    return x+1

@explain
def explainadd(x):
    return x+1

@double
@explain
def doubleexplainadd(x):
    return x+1

@explain
@double
def explaindoubleadd(x):
    return x+1

print add(42)
print "---"
print doubleadd(42)
print "---"
print explainadd(42)
print "---"
print doubleexplainadd(42)
print "---"
print explaindoubleadd(42)
print "---"
