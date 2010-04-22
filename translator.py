"""
Python to bytecode translator.

It is based on opcodes, that are well documented here:

http://docs.python.org/library/dis.html

It is dependent on the Python version, but the differences are minor (just
couple more opcodes have to be implemented for later versions of Python, and
some obsolete opcodes are not used anymore).
"""

import dis, opcode as python_opcode, struct

def opcode(func):
    """
    Registers the method in the Translator class.
    """
    Translator.opcdmap[func.__name__] = func
    return func

class Translator(object):
    """
    Decorator that translates the decorated function/class into bytecode.

    This is a base class. Subclass it, define opcodes and then decorate any
    function or class with your subclass.
    """
    varcount = 0
    # this opcdmap is filled in by the opcode decorator:
    opcdmap = {}

    def __init__(self, func, inClass=False, fname=None, anonymous=False):
        if isinstance(func, type):
            self._js = self.handle_class(func, inClass=inClass,
                    fname=fname, anonymous=anonymous)
        else:
            self._js = self.handle_function(func, inClass=inClass,
                    fname=fname, anonymous=anonymous)

    def execute(self, pc, block, stack, scope):
        if pc in self.hit:
            return -1
        self.hit.append(pc)

        opcd = _ord(self.co_code[pc])
        name = python_opcode.opname[opcd]
        pc += 1

        # build the arguments:
        args = [self, block, stack, scope]

        if opcd >= python_opcode.HAVE_ARGUMENT:
            arg, = struct.unpack('h', self.co_code[pc:pc+2])
            pc += 2

        if opcd in python_opcode.hasjrel:
            args.append(pc)
        elif opcd in python_opcode.hasjabs:
            # this is needed, because we call JUMP_IF_FALSE from there:
            if name == "POP_JUMP_IF_FALSE":
                args.append(pc)

        if opcd >= python_opcode.HAVE_ARGUMENT:
            if opcd in python_opcode.hasconst:
                arg = self.code.co_consts[arg]
            elif opcd in python_opcode.haslocal:
                arg = self.code.co_varnames[arg]
            elif opcd in python_opcode.hasname:
                arg = self.code.co_names[arg]
            args.append(arg)

        if name.startswith('INPLACE_'): # Why is this separate?  Just an optimization in the Py core?
            name = 'BINARY_' + name[len('INPLACE_'):]
        if name in self.opcdmap:
            #print(args)
            npc = self.opcdmap[name](*args)
            if npc != None:
                pc = npc
        elif name in self.binaryOpers:
            args.append(self.binaryOpers[name])
            self.binaryOp(*args[1:])
        else:
            raise Exception('Unsupported opcode `%s\'' % name)

        return pc

    binaryOpers = dict(
        BINARY_ADD='+',
        BINARY_SUBTRACT='-',
        BINARY_MULTIPLY='*',
        BINARY_DIVIDE='/',
        BINARY_MODULO='%',
        BINARY_LSHIFT='<<',
        BINARY_RSHIFT='>>',
        BINARY_AND='&',
        BINARY_OR='|',
        BINARY_XOR='^'
    )

    def __str__(self):
        return self._js

def _ord(x):
    if isinstance(x, str):
        return ord(x)
    else:
        return x
