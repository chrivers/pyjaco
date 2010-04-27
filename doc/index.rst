.. py2js documentation master file, created by
   sphinx-quickstart on Tue Apr 27 13:05:04 2010.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to py2js
================

py2js is a Python to JavaScript translator.

**Webpage**: http://mattpap.github.com/py2js/html/

**Download** using git: ``git clone git://github.com/mattpap/py2js.git``,
other options: http://github.com/mattpap/py2js

It consists of two parts. The ``builtins.js`` library, which is a standalone
JavaScript library implementing Python types and builtin functions, and the
``py2js.py`` script that translates almost any Python code into JavaScript (that
depends on ``builtins.js``).

Contents:

.. toctree::
    :maxdepth: 2

    src/builtins.rst
    src/py2js.rst
    src/examples.rst

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

