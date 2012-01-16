print unichr(42)
print unichr(43)
try:
    print unichr("foo")
except TypeError, E:
    print "Could not convert string:", E
print unichr(42).__class__ == unicode
print type(unichr(42)), unicode
