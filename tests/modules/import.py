
from imported.modulea import *
import imported.moduleb

modulea_fn()
imported.moduleb.moduleb_fn()

ma = modulea_class()
print ma.msg(1)

mb = imported.moduleb.moduleb_class()
print mb.msg(2)
