
vals = [0,10,-30,173247,123,19892122]
 
formats = ['%o','%020o', '%-20o', '%#o', '+%o', '+%#o']

for val in vals:
	for fmt in formats:
		print fmt+":", fmt % val
