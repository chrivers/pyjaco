#! python
import testtools.tests
import testtools.runner
import unittest

unittest.main(
    testtools.tests,
    testRunner=testtools.runner.Py2JsTestRunner(verbosity=2),
    exit=False,
    verbosity=2
    )
