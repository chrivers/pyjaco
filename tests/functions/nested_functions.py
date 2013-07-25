def foo(x):

    def bar(x):

        def quux(x):
            return x + 1

        return quux(x) + 10

    return bar(x) + 100

print foo(0)
