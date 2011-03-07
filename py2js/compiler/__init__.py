import py2js
import ast
import inspect

class JSError(Exception):
    pass

class BaseCompiler(object):

    name_map = {
        'self'   : 'this',
        'True'   : 'true',
        'False'  : 'false',
        'None'  : 'null',

        'int' : '_int',
        'float' : '_float',

        'super' : '_super',

        # ideally we should check, that this name is available:
        'py_builtins' : '___py_hard_to_collide',
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
    ])

    bool_op = {
        'And'    : '&&',
        'Or'     : '||',
    }

    unary_op = {
        'Invert' : '~',
        'Not'    : '!',
        'UAdd'   : '+',
        'USub'   : '-',
    }

    binary_op = {
        'Add'    : '+',
        'Sub'    : '-',
        'Mult'   : '*',
        'Div'    : '/',
        'Mod'    : '%',
        'LShift' : '<<',
        'RShift' : '>>',
        'BitOr'  : '|',
        'BitXor' : '^',
        'BitAnd' : '&',
    }

    comparison_op = {
            'Eq'    : "==",
            'NotEq' : "!=",
            'Lt'    : "<",
            'LtE'   : "<=",
            'Gt'    : ">",
            'GtE'   : ">=",
            'Is'    : "===",
            'IsNot' : "is not", # Not implemented yet
        }

    def __init__(self):
        self.dummy_index = 0
        # This is the name of the class that we are currently in:
        self._class_name = None

        # This lists all variables in the local scope:
        self._scope = []
        # All calls to names within _class_names will be preceded by 'new'
        self._class_names = set()
        self._classes = {}

    def new_dummy(self):
        self.dummy_index += 1
        return "__dummy%d__" % self.dummy_index

    def visit(self, node, scope=None):
        try:
            visitor = getattr(self, 'visit_' + self.name(node))
        except AttributeError:
            raise JSError("syntax not supported (%s)" % node)

        if hasattr(visitor, 'statement'):
            return visitor(node, scope)
        else:
            return visitor(node)

    def indent(self, stmts):
        return [ "    " + stmt for stmt in stmts ]

