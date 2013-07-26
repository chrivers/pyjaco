try:
  print 42
except ValueError:
  print "should not happen"
else:
  print "should happen"

try:
  raise ValueError()
except:
  print "unspecific error happened"
else:
  print "should happen"

try:
  print 42
  raise ValueError()
  print "nope"
except ValueError:
  print "should happen"
else:
  print "should not happen"

