


def fib(x):
	if x == 1:
		return x
	else:
		return x*fib(x-1)

print fib(4)
