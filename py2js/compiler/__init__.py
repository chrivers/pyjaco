import py2js
import ast
import inspect

class JSError(Exception):
    pass

class BaseCompiler(object):

    name_map = {
        'self'  : 'this',
        'int'   : '_int',
        'float' : '_float',
        'super' : '__super',
        'py_builtins' : '__py_builtins'
    }

    builtin = set([
        'NotImplementedError',
        'ZeroDivisionError',
        'AssertionError',
        'AttributeError',
        'RuntimeError',
        'ImportError',
        'TypeError',
        'ValueError',
        'NameError',
        'IndexError',
        'KeyError',
        'StopIteration',

        '_int',
        '_float',
        'max',
        'min',
        'sum',
        'filter',
        'reduce'
    ])

    def __init__(self):
        self.index_var = 0
        # This is the name of the classes that we are currently in:
        self._class_name = []

        # This lists all variables in the local scope:
        self._scope = []
        self._classes = {}
        self._exceptions = []

    def alloc_var(self):
        self.index_var += 1
        return "$v%d" % self.index_var

    def visit(self, node):
        try:
            visitor = getattr(self, 'visit_' + self.name(node))
        except AttributeError:
            raise JSError("syntax not supported (%s: %s)" % (node.__class__.__name__, node))

        return visitor(node)

    def indent(self, stmts):
        return [ "    " + stmt for stmt in stmts ]

    ## Shared code

    def name(self, node):
        return node.__class__.__name__

    ## Shared visit functions

    def visit_AssignSimple(self, target, value):
        raise NotImplementedError()

    def visit_Assign(self, node):
        if len(node.targets) > 1:
            tmp = self.alloc_var()
            q = ["var %s = %s" % (tmp, self.visit(node.value))]
            for t in node.targets:
                q.extend(self.visit_AssignSimple(t, tmp))
            return q
        else:
            return self.visit_AssignSimple(node.targets[0], self.visit(node.value))
