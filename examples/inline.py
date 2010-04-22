from pyvascript import JavaScript
from AjaxHelper import AjaxHelper

@JavaScript
def test():
    alert('Test!')
    TestClass.new() # Notice the 'new'

@JavaScript
class TestClass(object):
    def __init__(self):
        alert('TestClass created')
        self.reset()

    def reset(self):
        self.value = 0

    def inc(self):
        alert(self.value)
        self.value += 1

@JavaScript
class AjaxTest(AjaxHelper):
    def __init__(self):
        self.post('/some/url')

    def success(self, data):
        alert(data)

    def failure(self, o):
        alert('Ajax failure...')

print '<script language="Javascript">'
print test
print TestClass
print AjaxTest
print '</script>'
