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

class AjaxHelper(object):
    def call(self, method, uri, query=''):
        callback = {
                'success':self.subSuccess,
                'failure':self.subFailure,
                'argument':[self]
            }

        if query != '':
            args = []
            for key in query:
                args[args.length] = key + '=' + encodeURIComponent(query[key])
            query = args.join('&')

        YAHOO.util.Connect.asyncRequest(method, uri, callback, query)

    def get(self, uri, query=None):
        self.call('GET', uri, query)

    def post(self, uri, query=None):
        self.call('POST', uri, query)

    def subSuccess(self, o):
        o.argument[0].success(YAHOO.lang.JSON.parse(o.responseText))

    def subFailure(self, o):
        o.argument[0].failure(o)

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
