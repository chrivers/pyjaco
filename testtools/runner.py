import sys
if sys.version_info < (2, 7):
    import unittest2 as unittest
else:
    import unittest

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
        test.stop = self.stop
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

