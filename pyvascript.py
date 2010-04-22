import inspect
from ast import parse, iter_fields, AST, dump, NodeVisitor

class JavaScriptVisitor(NodeVisitor):
    """
    Visits the python AST tree and transform it to Python.

    The visit(node) method returns either a string if the node is an
    expression, otherwise a list of strings if node is a list of statements
    (lines).
    """

    def __init__(self):
        self._scope = []

    def visit_block(self, l):
        s = []
        for statement in l:
            v = self.visit(statement)
            if isinstance(v, str):
                # just an expression
                s.append(v)
            else:
                s.extend(v)
        return s

    def indent(self, l):
        s = []
        for item in l:
            s.append("    %s" % item)
        return s

    def visit_block_and_indent(self, l):
        return self.indent(self.visit_block(l))

    def visit_If(self, node):
        s = []
        s.append("if (%s) {" % self.visit(node.test))
        s.extend(self.visit_block_and_indent(node.body))
        s.append("}")
        if len(node.orelse) > 0:
            s.append("else {")
            s.extend(self.visit_block_and_indent(node.orelse))
            s.append("}")
        return s

    def visit_Assign(self, node):
        assert len(node.targets) == 1
        target = node.targets[0]
        return ["%s = %s;" % (self.visit(target), self.visit(node.value))]

    def visit_AugAssign(self, node):
        return ["%s %s= %s;" % (self.visit(node.target),
            self.visit(node.op),
            self.visit(node.value))]

    def visit_Num(self, node):
        return str(node.n)

    def visit_Lt(self, node):
        return ">"

    def visit_Gt(self, node):
        return ">"

    def visit_Or(self, node):
        return "||"

    def visit_And(self, node):
        return "&&"

    def visit_Not(self, node):
        return "not"

    def visit_Eq(self, node):
        return "=="

    def visit_NotEq(self, node):
        return "!="

    def visit_Add(self, node):
        return "+"

    def visit_Sub(self, node):
        return "-"

    def visit_Mult(self, node):
        return "*"

    def visit_Div(self, node):
        return "/"

    def visit_arguments(self, node):
        return [self.visit(arg) for arg in node.args]

    def visit_Return(self, node):
        return ["return %s;" % self.visit(node.value)]

    def visit_FunctionDef(self, node):
        s = []
        args = ", ".join(self.visit(node.args))
        s.append("function %s(%s) {" % (node.name, args))
        s.extend(self.visit_block_and_indent(node.body))
        s.append("}")
        return s

    def visit_Compare(self, node):
        assert len(node.ops) == 1
        assert len(node.comparators) == 1
        op = node.ops[0]
        comp = node.comparators[0]
        return "%s %s %s" % (self.visit(node.left),
                self.visit(op),
                self.visit(comp)
                )

    def visit_UnaryOp(self, node):
        return "%s %s" % (self.visit(node.op),
                self.visit(node.operand)
                )

    def visit_BinOp(self, node):
        return "%s %s %s" % (self.visit(node.left),
                self.visit(node.op),
                self.visit(node.right)
                )

    def visit_Module(self, node):
        return self.visit_block(node.body)

    def visit_Name(self, node):
        return node.id

    def visit_Call(self, node):
        assert len(node.keywords) == 0
        assert node.starargs is None
        assert node.kwargs is None
        args = [self.visit(x) for x in node.args]
        return "%s(%s)" % (self.visit(node.func), ", ".join(args))

    def visit_Raise(self, node):
        assert node.inst is None
        assert node.tback is None
        return "raise %s;" % self.visit(node.type)

    def visit_Expr(self, node):
        return self.visit(node.value)

    def visit_Str(self, node):
        if node.s.find("\n") == -1:
            return '"%s"' % node.s
        else:
            # multiline strings not implemented in js
            return ''
            return '"""%s"""' % node.s

    def visit_Attribute(self, node):
        return "%s.%s" % (self.visit(node.value), node.attr)

    def visit_Tuple(self, node):
        els = [self.visit(e) for e in node.elts]
        return "(%s)" % (", ".join(els))

    def visit_List(self, node):
        els = [self.visit(e) for e in node.elts]
        return "[%s]" % (", ".join(els))

    def visit_Slice(self, node):
        if node.lower is None and node.upper is None and node.step is None:
            return ":"
        else:
            raise NotImplementedError("Slice")

    def visit_Subscript(self, node):
        return "%s[%s]" % (self.visit(node.value), self.visit(node.slice))

    def visit_Index(self, node):
        return self.visit(node.value)

    def visit_BoolOp(self, node):
        op = " %s " % self.visit(node.op)
        values = ["(%s)" % self.visit(v) for v in node.values]
        return op.join(values)

    def visit_For(self, node):
        assert len(node.orelse) == 0
        target = self.visit(node.target)
        iter = self.visit(node.iter)
        s = ["for %s in %s:" % (target, iter)]
        s.extend(self.visit_block_and_indent(node.body))
        return s

    def visit_While(self, node):
        assert len(node.orelse) == 0
        s = ["while %s:" % (self.visit(node.test))]
        s.extend(self.visit_block_and_indent(node.body))
        return s

    def generic_visit(self, node):
        def _f(x):
            if x is None:
                return "None"
            elif isinstance(x, str):
                return x
            elif isinstance(x, list):
                return [_f(y) for y in x]
            else:
                return self.visit(x)
        args = ', '.join(('%s=%s' % (a, _f(b)) for a, b in iter_fields(node)))
        rv = '%s(%s)' % (node.__class__.__name__, args)
        print "Generic visit:", rv
        return [rv]

def transform_js(s):
    v = JavaScriptVisitor()
    t = parse(s)
    return "\n".join(v.visit(t))

class JavaScript(object):

    def __init__(self, obj):
        obj_source = inspect.getsource(obj)
        self._js = transform_js(obj_source)

    def __str__(self):
        return self._js


#################
# this is the obsolete old version:
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

class JavaScript2(Translator):
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
