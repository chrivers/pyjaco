

a = { 1:'aaa', 'b':2 }

if 2 in a:
	print "2 in a - incorrect"

if 'b' in a:
	print "b in a - correct"

if 1 in a:
	print "1 in a - correct"

if 3 not in a:
	print "3 not in a - correct"

if 'x' not in a:
	print "x not in a - correct"
