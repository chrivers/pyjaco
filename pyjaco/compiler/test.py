################################################################################
# simple expressions
################################################################################
print 42

print 2+2
print 2-2
print 2/2
print 2*2
print 2**2

print "foo"

################################################################################
# function defs
################################################################################
def single0():
    pass

def single1(x):
    print x

def single2(*vargs):
    print x

def single3(**kwargs):
    print x

def def0(a,     b,     c,     d):
    print x

def def1(a,     b,     c,     d = 4):
    print x

def def2(a,     b,     c = 3, d = 4):
    print x

def def3(a,     b = 2, c = 3, d = 4):
    print x

def def4(a = 1, b = 2, c = 3, d = 4):
    print x

def defvar(a, b, c = 1, d = 2, *var):
    print x

def defkw(a, b, c = 1, d = 2, **kw):
    print x

def defvarkw(a, b, c = 1, d = 2, *var, **kw):
    print x

################################################################################
# try-except
################################################################################
try:
    print 10
except:
    print 20


try:
    print 10
except KeyboardInterrupt:
    print 20


try:
    print 10
except KeyboardInterrupt, E:
    print E

################################################################################
# try-except-else
################################################################################
try:
    print 10
except:
    print 20
else:
    print 30


try:
    print 10
except KeyboardInterrupt:
    print 20
else:
    print 30


try:
    print 10
except KeyboardInterrupt, E:
    print E
else:
    print 30

################################################################################
# try-finally
################################################################################
try:
    print 10
finally:
    print 20


################################################################################
# try-except-finally
################################################################################

try:
    print 10
except:
    print 20
finally:
    print 30

try:
    print 10
except KeyboardInterrupt:
    print 20
finally:
    print 30


try:
    print 10
except KeyboardInterrupt, E:
    print E
finally:
    print 30

