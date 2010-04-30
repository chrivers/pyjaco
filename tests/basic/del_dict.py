
mydict = {}

mydict["abc"] = "def"
mydict["def"] = "abc"
mydict["xyz"] = "rst"

print mydict["abc"]
print mydict["def"]
print mydict["xyz"]

del mydict["def"]

if "abc" in mydict:
	print "abc in mydict"
else:
	print "abc not in mydict"

if "def" in mydict:
	print "def in mydict"
else:
	print "def not in mydict"

if "xyz" in mydict:
	print "xyz in mydict"
else:
	print "xyz not in mydict"
