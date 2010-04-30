
def getkey(x):
	if x < 5:
		return x + 10
	else:
		return x

def revcmp(a,b):
	if b<a:
		return -1
	if b==a:
		return 0
	return 1

l = [4,7,2,3,8,1,3]

l.sort(revcmp,getkey)

print l[0]
print l[1]
print l[2]

print "---"

l.sort(revcmp,getkey,True)

print l[0]
print l[1]
print l[2]

