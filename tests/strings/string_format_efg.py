
a = 1.123456
b = 0.000000000324324
c = 18347894.213123
d = 0.0
e = -1324323.456
f = -0.000000000019892122

vars = [a,b,c,d,e,f]
codes = ['e','E','f','F','g','G']

fmts = ["a=%e","a=%10.5e","a=%+10.5e","a=%#e"]

for code in codes:
	for fmt in fmts:
		fmt = fmt.replace('e',code)
		for v in vars:
			print fmt + ":", fmt % v
