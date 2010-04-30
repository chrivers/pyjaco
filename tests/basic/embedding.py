"""py2js-verbatim:
function foo(x) {
	print(x);
}
"""

"""py2js-skip-begin"""
def foo(x):
	print x
"""py2js-skip-end"""

foo('bar')
