for x in [0, 0.4, 0.5, 0.6, -0, -1, -0.4, -0.4999, -0.5, -0.6]:
    print "Round %.2f: %d" % (x, round(x))

try:
    print round("foo")
except TypeError, E:
    print "Fail:", E
