__js_deps__ = (
        'http://yui.yahooapis.com/2.7.0/build/yahoo/yahoo-min.js',
        'http://yui.yahooapis.com/2.7.0/build/event/event-min.js',
        'http://yui.yahooapis.com/2.7.0/build/connection/connection-min.js',
        'http://yui.yahooapis.com/2.7.0/build/json/json-min.js'
    )

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
