import dis, struct
from translator import Translator, opcode

class JsDict(dict):
    def __repr__(self):
        return '{%s}' % ', '.join('%s : %s' % kv for kv in self.items())

class JsList(list):
    def __repr__(self):
        return '[%s]' % ', '.join(map(str, self))

class JsFunc(object):
    def __init__(self, name, args=()):
        self.name = name
        self.args = tuple(args)

    def __str__(self):
        return '%s(%s)' % (self.name, ', '.join(self.args))
    def __repr__(self):
        return str(self)

class JavaScript(Translator):
    """
    Python to JavaScript translator.

    Based on the Translator() class, it just implements the opcodes -> js
    translation.
    """

    def handle_class(self, cls, *args, **kwargs):
        super_class = object
        super_dir = dir(super_class)
        subdir = [elem for elem in dir(cls) if elem not in super_dir]
        subdir = [elem for elem in subdir if elem not in [
            '__dict__', '__module__', '__weakref__']]

        if cls.__init__ is not super_class.__init__:
            code = str(JavaScript(cls.__init__, inClass=True, fname=cls.__name__)).rstrip()[:-1].rstrip() + '\n'
        else:
            code = 'function %s() {\n' % cls.__name__

        for key in subdir:
            val = getattr(cls, key)
            if callable(val):
                continue

            code += '\tthis.%s = %s;\n' % (key, val)

        code += '}\n'

        for func in subdir:
            func = getattr(cls, func)
            if not callable(func):
                continue

            code += '%s.prototype.%s = %s' % (
                cls.__name__,
                func.__name__,
                str(JavaScript(func, inClass=True, anonymous=True))
            )

        return code

    def handle_function(self, func, inClass=False, fname=None, anonymous=False):
        self.code = func.func_code
        self.co_code = self.code.co_code

        self.hit = []
        pc = 0
        outer = []
        stack = []
        scope = [name for name in self.code.co_varnames[:self.code.co_argcount]]
        try:
            while pc != -1 and pc < len(self.co_code):
                pc = self.execute(pc, block=outer, stack=stack, scope=scope)
        except Exception:
            print
            dis.dis(func)
            raise

        if func.func_defaults:
            defaults = ''

            off = self.code.co_argcount - len(func.func_defaults)
            for i in range(len(func.func_defaults)):
                var = self.code.co_varnames[off+i]
                val = func.func_defaults[i]
                if val == None:
                    val = 'null'
                else:
                    if val is True:
                        val = 'true'
                    elif val is False:
                        val = 'false'
                    elif val is None:
                        val = 'None'
                    else:
                        val = repr(val)
                defaults += '\t%s = (typeof(%s) != \'undefined\' && %s != null) ? %s : %s;\n' % (
                        var, var, var, var, val
                    )
        else:
            defaults = ''

        if fname == None:
            fname = func.__name__

        if fname == '__top__':
            return '\n'.join(line for line in outer if line != 'return;')
        else:
            return \
'''
function%s(%s) {
%s%s
}
''' % (
                (not anonymous) and ' %s' % fname or '',
                ', '.join(self.code.co_varnames[inClass and 1 or 0:self.code.co_argcount]),
                defaults,
                '\n'.join('\t%s' % line for line in outer)
            )

    @opcode
    def DUP_TOP(self, _block, stack, _scope):
        stack.append(stack[-1])

    @opcode
    def DUP_TOPX(self, _block, stack, _scope, count):
        stack += stack[-count:]

    @opcode
    def POP_TOP(self, block, stack, _scope):
        top = stack.pop()

        if isinstance(top, tuple) and len(top) == 2:
            use, top = top
        else:
            use = True

        if use:
            block.append('%s;' % top)

    @opcode
    def POP_BLOCK(self, block, stack, _scope):
        return
        top = stack.pop()

        if isinstance(top, tuple) and len(top) == 2:
            use, top = top
        else:
            use = True

        if use:
            block.append('%s;' % top)

    @opcode
    def ROT_TWO(self, _block, stack, _scope):
        a, b = stack.pop(), stack.pop()
        stack.append(a)
        stack.append(b)
    @opcode
    def ROT_THREE(self, _block, stack, _scope):
        a, b, c = stack.pop(), stack.pop(), stack.pop()
        stack.append(a)
        stack.append(c)
        stack.append(b)

    @opcode
    def LOAD_ATTR(self, _block, stack, _scope, name):
        if name == 'new':
            stack.append('new %s' % stack.pop())
        else:
            stack.append('%s.%s' % (stack.pop(), name))
    @opcode
    def STORE_ATTR(self, block, stack, _scope, name):
        block.append('%s.%s = %s;' % (stack.pop(), name, stack.pop()))

    @opcode
    def LOAD_CONST(self, _block, stack, _scope, const):
        if const == None:
            stack.append('null')
        elif const is False:
            stack.append('false')
        elif const is True:
            stack.append('true')
        else:
            stack.append(repr(const))

    @opcode
    def LOAD_GLOBAL(self, _block, stack, _scope, name):
        if name == 'True':
            stack.append('true')
        elif name == 'False':
            stack.append('false')
        elif name == 'None':
            stack.append('null')
        else:
            stack.append(name)
    @opcode
    def STORE_GLOBAL(self, block, stack, scope, var):
        if stack[-1] == 'for':
            block.append(var)
            stack.pop()
        else:
            block.append('%s = %s;' % (var, stack.pop()))

    @opcode
    def LOAD_FAST(self, _block, stack, _scope, var):
        if var == 'self':
            var = 'this'
        stack.append(var)
    @opcode
    def STORE_FAST(self, block, stack, scope, var):
        if var in scope:
            decl = ''
        else:
            decl = 'var '
            scope.append(var)

        if stack[-1] == 'for':
            block.append(var)
            stack.pop()
        else:
            block.append('%s%s = %s;' % (decl, var, stack.pop()))

    @opcode
    def STORE_SUBSCR(self, block, stack, _scope):
        index, base, value = stack.pop(), stack.pop(), stack.pop()
        if isinstance(base, list) or isinstance(base, dict):
            base[index] = value
        else:
            block.append('(%s)[%s] = %s' % (base, index, value))

    @opcode
    def UNARY_NEGATIVE(self, _block, stack, _scope):
        stack.append('-(%s)' % stack.pop())
    @opcode
    def UNARY_NOT(self, _block, stack, _scope):
        stack.append('!(%s)' % stack.pop())

    @opcode
    def BINARY_SUBSCR(self, _block, stack, _scope):
        a, b = stack.pop(), stack.pop()
        stack.append('(%s)[%s]' % (b, a))

    @opcode
    def BINARY_POWER(self, _block, stack, _scope):
        a, b = stack.pop(), stack.pop()
        stack.append('Math.pow(%s, %s)' % (b, a))
    def binaryOp(self, _block, stack, _scope, oper):
        a, b = stack.pop(), stack.pop()
        stack.append('(%s) %s (%s)' % (b, oper, a))

    @opcode
    def BUILD_MAP(self, _block, stack, _scope, _arg):
        stack.append(JsDict())

    @opcode
    def STORE_MAP(self, _block, stack, _scope):
        key = stack.pop()
        value = stack.pop()
        d = stack.pop()
        d[key] = value
        stack.append(d)

    @opcode
    def BUILD_TUPLE(self, _block, stack, _scope, count):
        stack.append(JsList([stack.pop() for i in range(count)][::-1]))

    @opcode
    def BUILD_LIST(self, _block, stack, _scope, count):
        stack.append(JsList([stack.pop() for i in range(count)][::-1]))

    @opcode
    def CALL_FUNCTION(self, _block, stack, _scope, count):
        if count == 0:
            stack.append(JsFunc(stack.pop()))
        else:
            stack.append(JsFunc(stack[-count-1], [str(elem) for elem in stack[-count:]]))
            del stack[-count-2:-1]

    @opcode
    def RETURN_VALUE(self, block, stack, _scope):
        val = stack.pop()
        if val != 'null':
            block.append('return %s;' % val)
        else:
            block.append('return;')

    @opcode
    def COMPARE_OP(self, _block, stack, _scope, opname):
        a, b = stack.pop(), stack.pop()
        import opcode
        stack.append('%s %s %s' % (b, opcode.cmp_op[opname], a))

    @opcode
    def UNPACK_SEQUENCE(self, _block, stack, _scope, count):
        s = stack.pop()
        for i in reversed(range(count)):
            stack.append("%s[%d]" % (s, i))

    @opcode
    def RAISE_VARARGS(self, block, stack, _scope, argc):
        assert argc == 1
        block.append(str(stack.pop()))

    @opcode
    def GET_ITER(self, _block, stack, _scope):
        pass
    @opcode
    def FOR_ITER(self, block, stack, _scope, pc, delta):
        block.append(stack.pop())
        stack[0] = 'for'
        stack.append('for')

    def addSemicolon(self, line):
        if (
            line.lstrip().startswith('if') or
            line.lstrip().startswith('else') or
            line.lstrip().startswith('while') or
            line.lstrip().startswith('for') or
            line.rstrip().endswith(';') or
            line.rstrip().endswith('}')
        ):
            return ''

        return ';'
    @opcode
    def SETUP_LOOP(self, block, stack, scope, pc, delta):
        nblock = []
        nstack = ['while']
        nscope = [var for var in scope]
        tpc = pc
        while tpc != -1 and tpc < len(self.co_code):
            tpc = self.execute(tpc, block=nblock, stack=nstack, scope=nscope)

        if nstack[0] == 'while':
            try:
                while_, cond = nblock[0]
                assert while_ == 'while'

                block.append('while(%s)%s' % (cond, len(nblock) != 2 and ' {' or ''))
                for line in nblock[1:]:
                    block.append('\t%s' % line)
                if len(nblock) != 2:
                    block.append('}')
            except Exception:
                raise Exception('Could not build while block %i-%i, nblock follows: %r' % (pc, pc+delta, nblock))
        elif nstack[0] == 'for' and isinstance(nblock[0], JsFunc) and nblock[0].name == 'range':
            args = nblock[0].args
            var = nblock[1]
            if len(args) == 1:
                begin = '0'
                end = args[0]
                step = '1'
            elif len(args) == 2:
                begin, end = args
                step = '1'
            elif len(args) == 3:
                begin, end, step = args

            setup = ['%s = %s' % (var, begin)]

            if not end.isdigit():
                setup.append('__end%i = %s' % (self.varcount, end))
                end = '__end%i' % self.varcount
                self.varcount += 1

            if not step.isdigit():
                setup.append('__step%i = %s' % (self.varcount, step))
                step = '__step%i' % self.varcount
                self.varcount += 1

            expr = '%s; %s < %s; %s += %s' % (', '.join(setup), var, end, var, step)
            block.append('for(%s)%s' % (expr, len(nblock) != 3 and ' {' or ''))
            for line in nblock[2:]:
                block.append('\t%s%s' % (line, self.addSemicolon(line)))
            if len(nblock) != 3:
                block.append('}')
        elif nstack[0] == 'for':
            block.append('for(var %s in %s)%s' % (nblock[1], nblock[0], len(nblock) != 3 and ' {' or ''))
            for line in nblock[2:]:
                block.append('\t%s%s' % (line, self.addSemicolon(line)))
            if len(nblock) != 3:
                block.append('}')

        return pc + delta
    @opcode
    def BREAK_LOOP(self, block, _stack, _scope):
        block.append('break;')

    @opcode
    def POP_JUMP_IF_FALSE(self, block, stack, scope, pc, target):
        r = self.JUMP_IF_FALSE(block, stack, scope, pc, target-pc)
        stack.pop()
        return r

    @opcode
    def JUMP_IF_FALSE(self, block, stack, scope, pc, delta):
        if len(stack) >= 2 and stack[-2] == 'while':
            # this doesn't always work, sometimes the "else" part should be
            # executed
            block.append(('while', stack[-1]))
            stack.append((False, stack.pop()))
        else:
            cond = stack.pop()
            stack.append((False, cond))
            nblock = [('if', pc + delta)]
            nstack = [elem for elem in stack]
            nscope = [var for var in scope]
            tpc = pc
            while tpc != -1 and tpc < pc + delta and tpc < len(self.co_code):
                tpc = self.execute(tpc, block=nblock, stack=nstack, scope=nscope)

            block.append('if(%s)%s' % (cond, len(nblock) != 2 and ' {' or ''))
            hasElse = False
            for line in nblock:
                if isinstance(line, tuple):
                    if line[0] == 'else':
                        hasElse = True
                        pc += delta
                        delta = line[1] - pc
                        break
                    else:
                        continue
                block.append('\t%s%s' % (line, self.addSemicolon(line)))
            if len(nblock) != 2:
                block.append('}')

            if hasElse:
                nblock = []
                nstack = [elem for elem in stack]
                nscope = [var for var in scope]
                tpc = pc
                while tpc != -1 and tpc < pc + delta and tpc < len(self.co_code):
                    tpc = self.execute(tpc, block=nblock, stack=nstack, scope=nscope)
                if len(nblock) != 0:
                    block.append('else%s' % (len(nblock) != 1 and ' {' or ''))
                    for line in nblock:
                        block.append('\t%s%s' % (line, self.addSemicolon(line)))
                    if len(nblock) != 1:
                        block.append('}')

            return pc + delta

    @opcode
    def JUMP_IF_TRUE(self, block, stack, scope, pc, delta):
        return self.JUMP_IF_FALSE(block, stack[:-1] + ['!(%s)' % stack[-1]], scope, pc, delta)

    @opcode
    def JUMP_FORWARD(self, block, _stack, _scope, pc, delta):
        if isinstance(block[0], tuple) and block[0][0] == 'if':
            del block[0]
            block.append(('else', pc + delta))
        return pc + delta

    @opcode
    def JUMP_ABSOLUTE(self, block, _stack, _scope, pc):
        if len(block) > 0 and isinstance(block[0], tuple) and block[0][0] == 'if':
            del block[0]
            block.append(('else', pc))
        return pc

    @opcode
    def STOP_CODE(self, _block, _stack, _scope):
        pass
