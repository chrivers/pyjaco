class canary(object):

    def __init__(self, val):
        self.x = val

    def __str__(self):
        return "peep: %d" % self.x

    def __repr__(self):
        return "<canary with value %d>" % self.x

def vargs(a, *b):
    print a, b

c = canary(42)
print c
print str(c)
print repr(c)
print "%s" % c
print "%r" % c
print (c,)
print [c]
print dict(key = c)
vargs(1, c)
vargs(1, [c])
vargs(1, *[c])
