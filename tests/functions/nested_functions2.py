class Stuff(object):

    def foo(self, x):

        def bar(x):

            def quux(x):
                return x + 1

            return quux(x) + 10

        return bar(x) + 100

s = Stuff()
print s.foo(0)
