class NonCustom(object):
    
    def __repr__(self):
        return "noncustom"

class Custom(object):

    def __hash__(self):
        return 1

    def __eq__(self, other):
        return hash(self) == hash(other)

    def __repr__(self):
        return "custom"

d = dict()
d[True] = "true"
d[False] = "false"
d[1] = "one"
d[NonCustom()] = "noncustom here"
d[Custom()] = "custom here"
print sorted(d.items())
print hash(Custom())
