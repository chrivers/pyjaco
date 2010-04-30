

a = "hello"

try:
	try:
		print "Trying illegal access"
		x = "abc"
		x.abc()
	except:
		print "Exception raised, re-raising"
		raise
except:
	print "Exception raised"
	pass
