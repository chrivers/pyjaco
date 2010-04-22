<%namespace name="ps" module="PyvaScript"/>
<%ps:pyvascript>
from AjaxHelper import *

def test():
	alert('Test!')
	TestClass.new() # Notice the 'new'

class TestClass:
	def __init__(self):
		alert('TestClass created')
		self.reset()
	
	def reset(self):
		self.value = 0
	
	def inc(self):
		alert(self.value)
		self.value += 1

class AjaxTest(AjaxHelper):
	def __init__(self):
		self.post('/some/url')
	
	def success(self, data):
		alert(data)
	
	def failure(self, o):
		alert('Ajax failure...')
</%ps:pyvascript>
