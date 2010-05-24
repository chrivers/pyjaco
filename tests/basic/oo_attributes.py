class Foobar(object):
    foo = 1
    bar = [1, 2, 3]

my_foobar = Foobar()
print my_foobar.foo
print my_foobar.bar
print Foobar.foo
print Foobar.bar
my_foobar.foo = 2
my_foobar.bar.append(5)
print my_foobar.foo
print my_foobar.bar
print Foobar.foo
print Foobar.bar
Foobar.foo = 3
Foobar.bar.append(6)
print my_foobar.foo
print my_foobar.bar
print Foobar.foo
print Foobar.bar
