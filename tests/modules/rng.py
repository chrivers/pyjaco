
from mtrandom import *

def float2str(v,dp):
	s = str(v)
	dotpos = s.find(".")
	if dotpos >= 0:
		return s[:dotpos+dp+1]
	return s

class RNG:
    def __init__(self):
        init = [0x123, 0x234, 0x345, 0x456]
        self.r = MersenneTwister()
        self.r.init_by_array(init,4)

    def next(self):
        return self.r.genrand_res53()

if __name__ == "__main__":
    r = RNG()
    print float2str(r.next(),9)
    print float2str(r.next(),9)
    print float2str(r.next(),9)

