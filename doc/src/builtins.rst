Builtins.js
===========

JavaScript library that implements Python types and Python builtin functions.

The goal of this library is to implement all Python builtin types and functions
as a small standalone JS library, that anyone can use in their JS projects.
Using this library, one can write a JS code that behaves pretty much like
Python (e.g. for loops using iterators, lists, dicts, slicing, ...), except of
course that sometimes you need to use quite verbose syntax, e.g.
``f.__getitem__(slice(1, null))`` instead of ``f[1:]``. It is then a matter of
a good Python to JavaScript translator to convert the Python syntax to JS with
the help of this library.

See the file `tests/test_builtins.js <http://github.com/qsnake/py2js/blob/master/tests/test_builtins.js>`_ for
thorough tests that you can use as examples how to use the library. Below you
can find a brief documentation with a few examples to get some idea what this
library can do for you.

Types
-----

It currently implements the following types:

**iter**
::

    js> f = list([1, 4, 3])
    [1, 4, 3]
    js> i = iter(f)
    <iter of 1,4,3 at 0>
    js> i.next()
    1
    js> i.next()
    4
    js> i.next()
    3
    js> i.next()
    uncaught exception: StopIteration: no more items


**tuple**
::

    js> f = tuple([1, 4, 3])
    (1, 4, 3)
    js> f
    (1, 4, 3)

**list**
::

    js> f = list([1, 4, 3])
    [1, 4, 3]
    js> f.append(4)
    js> f
    [1, 4, 3, 4]

**dict**
::

    js> f = dict({1: 4, 3: 5})
    {1: 4, 3: 5}
    js> f.__getitem__(3)
    5


**slice**
::

    js> f = tuple([1, 4, 3])
    (1, 4, 3)
    js> f.__getitem__(slice(1, null))
    (4, 3)
    js> f.__getitem__(slice(0, 1))
    (1,)



Builtin functions
-----------------

* assert
* hasattr
* getattr
* setattr
* hash
* len
* str
* range
* map
* zip
* isinstance
* float

Examples::

    js> range(5)
    [0, 1, 2, 3, 4]
    js> len(range(5))
    5
    js> hash(tuple([1, 3]))
    221750528


Exceptions
----------

* NotImplementedError
* ZeroDivisionError
* AssertionError
* AttributeError
* RuntimeError
* ImportError
* TypeError
* ValueError
* NameError
* IndexError
* KeyError
* StopIteration

