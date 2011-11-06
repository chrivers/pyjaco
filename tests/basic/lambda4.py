
la = []

for x in range(5):
    la.append(lambda x: (lambda q: q + x)(x))

print la[3](1)
