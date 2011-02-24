py2js
=====

Python to JavaScript translator.

Webpage: http://qsnake.github.com/py2js/html/

Installation
------------

git clone git://github.com/qsnake/py2js.git
cd py2js

Examples
--------

firefox examples/gol.html

And the game of life should show in the browser. If it doesn't, it's a bug. You
can generate that file using

python examples/gol.py > examples/gol.html

Tests
-----

./run_tests.py

will run all tests, that are supposed to work. If any test fails, it's a bug.

./run_tests.py -a

will run all tests including those that are known to fail (currently). It
should be understandable from the output.

License
-------

MIT, see the LICENSE file for exact details.
