from pyvascript import JavaScript

@JavaScript
class A(object):

    def f(self, x):
        return x + 1

print A
