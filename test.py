import unittest
import os

class Py2JsTestResult(unittest.result.TestResult):

  def __init__(self, *a, **k):
    super(Py2JsTestResult, self).__init__(*a, **k)
    self.currentTest = None
    self.__state = "[OK]"
    self.__faild = False

  def startTest(self, test):
    super(Py2JsTestResult, self).startTest(test)
    if self.currentTest != test.templ["name"]:
      self.testsleft = 4
      self.currentTest = test.templ["name"]
      self.testsRun += 1
      self.__state = "[OK]"
      self.__faild = False
      self.row = test.templ["py_path"].replace("\\","/") + " [4]: "

  def stopTest(self, test):
    super(Py2JsTestResult, self).stopTest(test)
    self.testsleft -= 1
    if self.testsleft == 0:
      print self.row + " " * (80 - len(self.row) - len(self.__state)) + self.__state

  def addSuccess(self, test):
    if self.__faild:
      return
    super(Py2JsTestResult, self).addSuccess(test)
    self.row += "."
    self.__state = "[OK]"

  def addUnexpectedSuccess(self, test):
    if self.__faild:
      return
    super(Py2JsTestResult, self).addUnexpectedSuccess(test)
    self.row += "."
    self.__state = "should fail but [OK]"

  def addExpectedFailure(self, test, err):
    if self.__faild:
      return
    super(Py2JsTestResult, self).addExpectedFailure(test, err)
    self.__faild = True
    self.__state = "known to [FAIL]"

  def addFailure(self, test, err):
    if self.__faild:
      return
    super(Py2JsTestResult, self).addFailure(test, err)
    self.__faild = True
    self.__state = "[FAIL]"

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


def compile_and_run_file_failing_test(file_path, file_name=None):
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
        @unittest.expectedFailure
        def test_a_run_pyhton(self):
            cmd = 'python "%(py_path)s" > "%(py_out_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        @unittest.expectedFailure
        def test_b_compile_javascript(self):
            cmd = 'python pyjs.py --include-builtins "%(py_path)s" > "%(js_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        @unittest.expectedFailure
        def test_c_run_javascript(self):
            cmd = 'js -f "%(js_path)s" > "%(js_out_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
        @unittest.expectedFailure
        def test_d_check_output(self):
            cmd = 'diff "%(py_out_path)s" "%(js_out_path)s" > "%(diff_path)s" 2> "%(error)s"' % self.templ
            self.assertEqual(0, os.system(cmd))
    CompileAndRunFile.__name__ = file_name
    return CompileAndRunFile

