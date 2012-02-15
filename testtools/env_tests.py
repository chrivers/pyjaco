"""\
Includes tests that check the setup for the tests.
If the library is compiled and if there is a js interpreter.
"""
import os
import sys
if sys.version_info < (2, 7):
    import unittest2 as unittest
else:
    import unittest
import tempfile
from util import run_command

class EnviromentTest(unittest.TestCase):
    "Test case that makes sure that the environment is up and working"
    def reportProgres(self):
        """Should be overloaded by the test result class"""

    def stop(self):
        """Should be overloaded by the test result class"""

    def runTest(self):
        """The actual test goes here."""
        if run_command(
            "echo | js > %s" %
            os.path.join(
                tempfile.gettempdir(),
                tempfile.gettempprefix()
                )
            ):
            self.stop()
            raise RuntimeError("""Can't find the "js" command.""")
        self.reportProgres()
        if not os.path.exists("py-builtins.js"):
            self.stop()
            raise RuntimeError("""Can't find the "py-builtins.js" command.""")
        self.reportProgres()

    def __str__(self):
        return 'Looking for "js" and "py-builtins" [2]: '


