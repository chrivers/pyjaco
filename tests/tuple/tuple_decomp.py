def a():
  return (1, 2)

def b():
  return "ab"

def c():
  return [1, 2]

def d():
  return [[1, 2]]

def e():
  return dict(key = [1, 2])

x, y = a()
print x, y
x, y = b()
print x, y
x, y = c()
print x, y
x, y = d()[0]
print x, y
x, y = e()["key"]
print x, y
