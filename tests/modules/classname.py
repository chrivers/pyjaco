
from modules.moda import ModA

m = ModA('hello')
m.describe()

mc = m.clone()
mc.describe()
