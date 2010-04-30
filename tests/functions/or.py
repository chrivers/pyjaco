
tests = [(False,False),(False,True),(True,False),(True,True),(True,None),(False,None),(None,True),(None,False)]

def pp(v):
	if v == False:
		return "F"
	if v == True:
		return "T"
	return "?"

for t in tests:
	(b1,b2) = t
	print pp(b1) + " OR " + pp(b2) + "=" + pp(b1 or b2)
