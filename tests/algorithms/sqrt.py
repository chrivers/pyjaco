def abs(x):
    if x > 0:
        return x
    else:
        return -x

def sqrt(x):
    eps = 1e-10
    x = float(x)
    r = x/2
    residual = r**2 - x
    while abs(residual) > eps:
        r_d = -residual/(2*r)
        r += r_d
        residual = r**2 - x
    return r

def p(x):
    prec = 11
    l = list(iter(str(x)))[:prec]
    if not "." in l:
        l.append(".")
        l.append("0")
    while len(l) < prec:
        l.append("0")
    s = ""
    for c in l:
        s += c
    return s

print p(sqrt(1))
print p(sqrt(2))
print p(sqrt(3))
print p(sqrt(4))
print p(sqrt(5))
print p(sqrt(6))
print p(sqrt(7000))
