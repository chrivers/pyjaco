import unittest
import os

class Py2JsTestResult(unittest.runner.TextTestResult):

  def __init__(self, *a, **k):
    unittest.runner.TextTestResult.__init__(self, *a, **k)
    self.currentTest = None
    self.state = "[OK]"

  def startTest(self, test):
    if self.currentTest != test.templ["name"]:
      self.testsleft = 4
      self.currentTest = test.templ["name"]
      self.testsRun += 1
      self.state = "[OK]"
      self.row = self.currentTest
    if self.state not in ["[OK]", "should fail but [OK]"]:
      pass
      #self.stop()

  def stopTest(self, test):
    self.testsleft -= 1
    if self.testsleft == 0:
      print self.row + " " * (80 - len(self.row) - len(self.state)) + self.state

  def addSuccess(self, test):
    self.row += "."
    self.state = "[OK]"

  def addUnexpectedSuccess(self, test):
    self.unexpectedSuccesses += 1
    self.row += "."
    self.state = "should fail but [OK]",

  def addExpectedFailure(self, test, err):
    self.expectedFailures += 1
    self.row += "_"
    self.state = "known to [FAIL]",

  def addFailure(self, test, err):
    self.row += "_"
    self.state = "[FAIL]"

class Py2JsTestRunner(unittest.runner.TextTestRunner):
  resultclass = Py2JsTestResult



def compile_and_run_file_test(file_path, file_name=None):
    file_name = file_name if file_name else file_path

    temp = {
        "py_path": file_path, 
        "py_out_path": file_path + ".out",
        "js_path": file_path + ".js",
        "js_out_path": file_path + ".js.out",
        "diff_path": file_path + ".diff",
        "error": file_path + ".err",
        "name": file_name,
        }

    class CompileAndRunFile(unittest.TestCase):
        templ = temp
        def test_a_run_pyhton(self):
            cmd = 'python "%(py_path)s" > "%(py_out_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        def test_b_compile_javascript(self):
            cmd = 'python pyjs.py --include-builtins "%(py_path)s" > "%(js_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        def test_c_run_javascript(self):
            cmd = 'js -f "%(js_path)s" > "%(js_out_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        def test_d_check_output(self):
            cmd = 'diff "%(py_out_path)s" "%(js_out_path)s" > "%(diff_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
    CompileAndRunFile.__name__ = file_name
    return CompileAndRunFile

