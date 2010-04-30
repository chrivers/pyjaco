
txt = "the quick brown fox jumped over the lazy dogthe"

c = txt.count("the")
print c
c = txt.count("the",0,-20)
print c
c = txt.count("the",3)
print c
c = txt.count("the",4,15)
print c
c = txt.count("the",1,len(txt))
print c
c = txt.count("the",4,len(txt)-1)
print c
