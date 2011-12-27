d = dict(foo = "foo")

print "starting"
print d.get("foo")
print d.get("bar", "bar")
print d.get("foo", "bar")
