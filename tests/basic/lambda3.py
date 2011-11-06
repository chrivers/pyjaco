
la = []

for x in range(5):
    la.append((lambda y: lambda q: q + y)(x))
#    la.append(lambda y: (lambda q: q + y)(x))

print la[0](10)
print la[1](10)
print la[2](10)
print la[3](10)
print la[4](10)
