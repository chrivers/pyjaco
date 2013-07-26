
try:
    raise IOError("foo")
except Exception, e:
    print e.message

try:
    raise IOError("foo")
except:
    print "x"

try:
    raise IOError("foo")
except TypeError:
    print "type"
except IOError:
    print "io"
except:
    print "y"

def foo():
    try:
        raise IOError("foo")
    except TypeError, e:
        print e.message

try:
    foo()
except IOError:
    print "z"
