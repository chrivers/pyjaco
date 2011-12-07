class A(list):

    def my_append(self, a):
        self.append(a)

a = A()
print a
a.append(5)
print a
a.my_append(6)
print a
a.remove(5)
print a
