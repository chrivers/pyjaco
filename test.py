import unittest
import os

class Py2JsTestResult(unittest.result.TestResult):

  def __init__(self, *a, **k):
    super(Py2JsTestResult, self).__init__(*a, **k)
    self.__faild = False

  def startTest(self, test):
    super(Py2JsTestResult, self).startTest(test)
    self.__state = "[Error]"

  def stopTest(self, test):
    super(Py2JsTestResult, self).stopTest(test)
    row = str(test) + "." * test.number_of_tests_cleard 
    print row + " " * (80 - len(row) - len(self.__state)) + self.__state

  def addSuccess(self, test):
    super(Py2JsTestResult, self).addSuccess(test)
    self.__state = "[OK]"

  def addUnexpectedSuccess(self, test):
    super(Py2JsTestResult, self).addUnexpectedSuccess(test)
    self.__state = "should fail but [OK]"

  def addExpectedFailure(self, test, err):
    super(Py2JsTestResult, self).addExpectedFailure(test, err)
    self.__state = "known to [FAIL]"

  def addFailure(self, test, err):
    super(Py2JsTestResult, self).addFailure(test, err)
    self.__state = "[FAIL]"

class Py2JsTestRunner(unittest.runner.TextTestRunner):
  resultclass = Py2JsTestResult


def compile_and_run_file_test(file_path, file_name=None):
    file_name = file_name if file_name else file_path

    class CompileAndRunFile(unittest.TestCase):
        templ = {
        "py_path": file_path, 
        "py_out_path": file_path + ".out",
        "js_path": file_path + ".js",
        "js_out_path": file_path + ".js.out",
        "diff_path": file_path + ".diff",
        "error": file_path + ".err",
        "name": file_name,
        }
        def runTest(self):
            self.number_of_tests_cleard = 0
            commands = (
                'python "%(py_path)s" > "%(py_out_path)s" 2> "%(error)s"' % self.templ,
                'python pyjs.py --include-builtins "%(py_path)s" > "%(js_path)s" 2> "%(error)s"' % self.templ,
                'js -f "%(js_path)s" > "%(js_out_path)s" 2> "%(error)s"' % self.templ,
                'diff "%(py_out_path)s" "%(js_out_path)s" > "%(diff_path)s" 2> "%(error)s"' % self.templ,
                )
            for cmd in commands:
                self.assertEqual(0, os.system(cmd))
                self.number_of_tests_cleard += 1
        def __str__(self):
            return "%(py_path)s [4]: " % self.templ

    return CompileAndRunFile

def compile_and_run_file_failing_test(*a, **k):
    _class = compile_and_run_file_test(*a, **k)

    class FailingTest(_class):
        @unittest.expectedFailure
        def runTest(self):
          return super(FailingTest, self).runTest()

    return FailingTest

