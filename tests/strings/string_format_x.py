
vals = [0,10,-30,173247,123,19892122]
 
formats = ['%x','%020x','%X', '%020X', '%-20x', '%#x']

for val in vals:
	for fmt in formats:
		print fmt+":", fmt % val
