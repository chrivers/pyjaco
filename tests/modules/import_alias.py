
from imported.alias_fns import foo as bar
from imported.alias_classes import spam as eggs

# call imported function
bar()

# call imported class
e = eggs()
e.msg()


