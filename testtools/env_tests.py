import os
import unittest
class EnviromentTest(unittest.TestCase):
    "Testcase that makeshure that the env is up"
    def reportProgres(self):
      """Should be overloaded by Testresult class"""
    
    def stop(self):
      """Should be overloaded by Testresult class"""

    def stop_if_not_equal(self, value1, value2):
      """If value1!=value2 stop all tests"""
      if value1 != value2:
        self.stop()
      else:
        self.assertEqual(value1, value2)

    def runTest(self):
      """The actual test goes here."""
      self.stop_if_not_equal(True, os.path.exists("js") or os.path.exists("js.exe"))
      self.reportProgres()
      self.stop_if_not_equal(True, os.path.exists("py-builtins.js"))
      self.reportProgres()
      



    def __str__(self):
        return "checking enviroment [2]: "


