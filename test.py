"""
Module that defiens Tool functions and test runers/result for use with
the unittestlibrary.
"""
import unittest
import os
class Py2JsTestResult(unittest.TestResult):
    """Test result class handeling all the results reported by the tests"""

    def __init__(self, *a, **k):
        import testtools.writer
        super(Py2JsTestResult, self).__init__(*a, **k)
        self.__writer = testtools.writer.Writer(a[0])
        self.__faild = False
        self.__color = ""
        self.__state = ""

    def startTest(self, test):
        super(Py2JsTestResult, self).startTest(test)
        test.reportProgres = self.addProgress
        self.__writer.write(str(test))
        self.__state = "[Error]"
        self.__color = "Red"

    def stopTest(self, test):
        super(Py2JsTestResult, self).stopTest(test)
        self.__writer.write(self.__state, align="right", color=self.__color)

    def addProgress(self):
        """Part of tests done"""
        self.__writer.write(".")

    def addSuccess(self, test):
        super(Py2JsTestResult, self).addSuccess(test)
        self.__color = "Green"
        self.__state = "[OK]"

    def addUnexpectedSuccess(self, test):
        super(Py2JsTestResult, self).addUnexpectedSuccess(test)
        self.__color = "Green"
        self.__state = "should fail but [OK]"

    def addExpectedFailure(self, test, err):
        super(Py2JsTestResult, self).addExpectedFailure(test, err)
        self.__color = "Purple"
        self.__state = "known to [FAIL]"

    def addFailure(self, test, err):
        super(Py2JsTestResult, self).addFailure(test, err)
        self.__color = "Red"
        self.__state = "[FAIL]"
    
    def stopTestRun(self):
        super(Py2JsTestResult, self).stopTestRun()
        self.__writer.write("\n")

class Py2JsTestRunner(unittest.TextTestRunner):
    """Test runner with Py2JsTestResult as result class"""
    resultclass = Py2JsTestResult

def run_with_stdlib(file_path, file_name=None):
    """Creats a test that runs a js file with the stdlib."""
    file_name = file_name if file_name else file_path

    class TestStdLib(unittest.TestCase):
        """Tests js code with the stdlib"""
        templ = {
            "js_path": file_path, 
            "js_unix_path": file_path, 
            "js_out_path": file_path + ".out",
            "js_error": file_path + ".err",
            "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by the Testresult class."""
    
        def runTest(self):
            """The actual test goes here."""
            cmd = (
                  'js -f "py-builtins.js" '
                  '-f "%(js_path)s" > "%(js_out_path)s" 2> "%(js_error)s"'
                  )% self.templ
            self.assertEqual(0, os.system(cmd))
            self.reportProgres()
        def __str__(self):
            return "%(js_unix_path)s [1]: " % self.templ

    return TestStdLib

def compile_file_test(file_path, file_name=None):
    """Creates a test that tests if a file can be compield by python"""
    file_name = file_name if file_name else file_path
    
    class CompileFile(unittest.TestCase):
        """Test if a file can be compield by python."""

        templ = {
            "py_path": file_path, 
            "py_unix_path": file_path, 
            "py_out_path": file_path + ".out",
            "py_error": file_path + ".err",
            "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by the Testresult class"""

        def runTest(self):
            """The actual test goes here."""
            commands = (
                (
                'python "%(py_path)s" > '
                '"%(py_out_path)s" 2> "%(py_error)s"'
                ) % self.templ,
              )
            for cmd in commands:
                self.assertEqual(0, os.system(cmd))
                self.reportProgres()
        def __str__(self):
            return "%(py_unix_path)s [1]: " % self.templ
    return CompileFile




def compile_and_run_file_test(file_path, file_name=None):
    """Creats a test that compiles and runs the python file as js"""
    file_name = file_name if file_name else file_path

    class CompileAndRunFile(unittest.TestCase):
        """Tests that a file can be compiled and run as js"""
        templ = {
        "py_path": file_path, 
        "py_unix_path": file_path, 
        "py_out_path": file_path + ".out",
        "js_path": file_path + ".js",
        "js_out_path": file_path + ".js.out",
        "py_error": file_path + ".err",
        "js_error": file_path + "js.err",
        "compiler_error": file_path + ".comp.err",
        "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by Testresult class"""

        def runTest(self):
            """The actual test goes here."""
            python_command = (
                'python "%(py_path)s" > "%(py_out_path)s" 2> '
                '"%(py_error)s"'
                ) % self.templ
            compile_command = (
                'python pyjs.py --include-builtins '
                '"%(py_path)s" > "%(js_path)s" 2> '
                '"%(compiler_error)s"'
                ) % self.templ 
            javascript_command = (
                'js -f "%(js_path)s" > "%(js_out_path)s" 2> '
                '"%(js_error)s"' 
                ) % self.templ
            commands = (
                python_command,
                compile_command,
                javascript_command
                )
            for cmd in commands:
                self.assertEqual(0, os.system(cmd))
                self.reportProgres()
            self.assertEqual(
                file(self.templ["py_out_path"]).readlines(),
                file(self.templ["js_out_path"]).readlines()
                )
            self.reportProgres()

        def __str__(self):
            return "%(py_unix_path)s [4]: " % self.templ

    return CompileAndRunFile

def compile_and_run_file_failing_test(*a, **k):
    """Turn a test to a failing test"""
    _class = compile_and_run_file_test(*a, **k)

    class FailingTest(_class):
        """Failing test"""
        @unittest.expectedFailure
        def runTest(self):
            return super(FailingTest, self).runTest()

    return FailingTest

