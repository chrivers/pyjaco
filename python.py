import inspect
from ast import parse, iter_fields, AST, dump, NodeVisitor

class PythonVisitor(NodeVisitor):
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
        s.append("if %s:" % self.visit(node.test))
        s.extend(self.visit_block_and_indent(node.body))
        if len(node.orelse) > 0:
            s.append("else:")
            s.extend(self.visit_block_and_indent(node.orelse))
        return s

    def visit_Assign(self, node):
        assert len(node.targets) == 1
        target = node.targets[0]
        return ["%s = %s" % (self.visit(target), self.visit(node.value))]

    def visit_AugAssign(self, node):
        return ["%s %s= %s" % (self.visit(node.target),
            self.visit(node.op),
            self.visit(node.value))]

    def visit_Num(self, node):
        return str(node.n)

    def visit_Lt(self, node):
        return ">"

    def visit_Gt(self, node):
        return ">"

    def visit_Or(self, node):
        return "or"

    def visit_And(self, node):
        return "and"

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
        return ["return %s" % self.visit(node.value)]

    def visit_FunctionDef(self, node):
        s = []
        args = ", ".join(self.visit(node.args))
        s.append("def %s(%s):" % (node.name, args))
        s.extend(self.visit_block_and_indent(node.body))
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
        return "raise %s" % self.visit(node.type)

    def visit_Expr(self, node):
        return self.visit(node.value)

    def visit_Str(self, node):
        if node.s.find("\n") == -1:
            return '"%s"' % node.s
        else:
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

def transform_py(s):
    v = PythonVisitor()
    t = parse(s)
    return "\n".join(v.visit(t))

class Python(object):

    def __init__(self, obj):
        obj_source = inspect.getsource(obj)
        self._python = transform_py(obj_source)

    def __str__(self):
        return self._python

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

class PyFunc(object):
    def __init__(self, name, args=()):
        self.name = name
        self.args = tuple(args)

    def __str__(self):
        return '%s(%s)' % (self.name, ', '.join(self.args))
    def __repr__(self):
        return str(self)

class Python2(Translator):
    """
    Python to Python translator.

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
            code = str(Python(cls.__init__, inClass=True, fname=cls.__name__)).rstrip()[:-1].rstrip() + '\n'
        else:
            code = 'def %s():\n' % cls.__name__

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
                str(Python(func, inClass=True, anonymous=True))
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
def%s(%s):
%s%s
''' % (
                (not anonymous) and ' %s' % fname or '',
                ', '.join(self.code.co_varnames[inClass and 1 or 0:self.code.co_argcount]),
                defaults,
                '\n'.join('\t%s' % line for line in outer)
            )

    @opcode
    def POP_TOP(self, block, stack, _scope):
        top = stack.pop()

        if isinstance(top, tuple) and len(top) == 2:
            use, top = top
        else:
            use = True

        if use:
            block.append('%s' % top)

    @opcode
    def LOAD_CONST(self, _block, stack, _scope, const):
        if const == None:
            stack.append('null')
        else:
            stack.append(repr(const))

    @opcode
    def LOAD_FAST(self, _block, stack, _scope, var):
        stack.append(var)

    @opcode
    def STORE_FAST(self, block, stack, scope, var):
        if not (var in scope):
            scope.append(var)

        if stack[-1] == 'for':
            block.append(var)
            stack.pop()
        else:
            block.append('%s = %s' % (var, stack.pop()))

    def binaryOp(self, _block, stack, _scope, oper):
        a, b = stack.pop(), stack.pop()
        stack.append('(%s) %s (%s)' % (b, oper, a))
    @opcode
    def RETURN_VALUE(self, block, stack, _scope):
        val = stack.pop()
        if val != 'null':
            block.append('return %s' % val)
        else:
            block.append('return')

    def addSemicolon(self, line):
        return ''

    @opcode
    def JUMP_IF_FALSE(self, block, stack, scope, pc, delta):
        cond = stack.pop()
        stack.append((False, cond))
        nblock = [('if', pc + delta)]
        nstack = [elem for elem in stack]
        nscope = [var for var in scope]
        tpc = pc
        while tpc != -1 and tpc < pc + delta and tpc < len(self.co_code):
            tpc = self.execute(tpc, block=nblock, stack=nstack, scope=nscope)

        block.append('if %s:' % cond)
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

        if hasElse:
            nblock = []
            nstack = [elem for elem in stack]
            nscope = [var for var in scope]
            tpc = pc
            while tpc != -1 and tpc < pc + delta and tpc < len(self.co_code):
                tpc = self.execute(tpc, block=nblock, stack=nstack, scope=nscope)
            if len(nblock) != 0:
                block.append('else:')
                for line in nblock:
                    block.append('\t%s%s' % (line, self.addSemicolon(line)))

        return pc + delta

    @opcode
    def JUMP_FORWARD(self, block, _stack, _scope, pc, delta):
        if isinstance(block[0], tuple) and block[0][0] == 'if':
            del block[0]
            block.append(('else', pc + delta))
        return pc + delta

    @opcode
    def JUMP_ABSOLUTE(self, block, _stack, _scope, pc):
        if len(block) > 0 and isinstance(block[0], tuple) and \
                block[0][0] == 'if':
            del block[0]
            block.append(('else', pc))
        return pc

    @opcode
    def STOP_CODE(self, _block, _stack, _scope):
        pass

    @opcode
    def COMPARE_OP(self, _block, stack, _scope, opname):
        a, b = stack.pop(), stack.pop()
        import opcode
        stack.append('%s %s %s' % (b, opcode.cmp_op[opname], a))
