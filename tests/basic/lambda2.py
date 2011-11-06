
x = lambda x: (lambda x: (lambda x: x + 2)(x+2))(x+2)

print x(2)
