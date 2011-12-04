"""pyjaco-verbatim:
function foo(x) {
    print(x);
}
"""

"""pyjaco-skip-begin"""
def foo(x):
    print x
"""pyjaco-skip-end"""

foo('bar')
