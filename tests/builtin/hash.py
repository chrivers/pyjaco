def section(name):
    print ("---- [ %s ] " % name)#.ljust(80, "-")

line = "-" * 42
section("Integers")

print hash(0xFFFFFFFF) <> hash(-2) <> hash(0) <> hash(1) <> hash(2)

section("Strings")

print hash("") <> hash("xy") <> hash("\0") <> hash("\0\0") <> hash("\42")

section("Tuples")

print hash(())
print hash((1,))

section("Boolean")

print hash(True)
print hash(False)

section("Function")

# def foo():
#     pass

# def bar():
#     pass

# print hash(foo) <> hash(bar) <> 0

section("Class")

# class Foo():
#     pass

#print hash(Foo)
#print hash(Foo())

