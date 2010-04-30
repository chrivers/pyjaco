s1 = "some string"

s2 = "some 'x' string"

s3 = 'some "x" string'

s4 = "some \"x\" string"

s5 = """some "x" string"""

s6 = """some "x" string
and some other string too...
"""

if s2 == s3:
    print "ok1"
if s3 == s4:
    print "ok2"
if s3 == s5:
    print "ok3"
if s3 != s6:
    print "ok4"
