x = range(19)

print x
print x[0]
print x[10]
print x[0:10]
print x[:10]
print x[None:10]
print x[10:]
print x[10:None]
print x[-10]
print x[-10:]
print x[:-10]

print x[:]
print x[::1]
print x[::-1]
print x[::2]
print x[::-2]
print x[::7]
print x[::-7]
print x[::20]
print x[::21]
print x[::-20]
print x[::-21]
print x[10::2]
print x[-7::2]
print x[-18::2]
print x[-19::2]
print x[-20::2]
print x[7::-2]
print x[23:10:-1]

print x[-40:]
print x[:-40:1]
print x[:-40:-1]

print x[:-30:-3]
print x[:-10:-3]

print x[-10::-2]
print x[10:20:3]
print x[-10:20:3]
print x[10:-20:3]
print x[-20:-10:3]
print x[-10:-20:3]
print x[10:-20:-3]
print x[-10:-20:-3]
 
print x[10:20:4]
print x[-10:20:4]
print x[10:-20:4]
print x[-20:-10:4]
print x[-10:-20:4]
print x[10:-20:-4]
print x[-10:-20:-4]

try:
    print x[::0]
except ValueError, E:
    print E
