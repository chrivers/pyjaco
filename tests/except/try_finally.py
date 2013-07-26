
try:
    1/0
except:
    print "nothing to see here, move along"

try:
    try:
        1/0
    finally:
        print "finally"
except Exception, E:
    print E
