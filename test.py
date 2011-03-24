try:
  import colorama
  colorama.init()
  has_colorama = True
except:
  has_colorama = False
import unittest
import os
import sys

class Writer(object):

    def __init__(self, file = None):
        import sys
        self._file = file or sys.stdout
        self._line_wrap = False
        self._write_pos = 0

    def write(self, text, color="", align="left", width=80):
        """
        Prints a text on the screen.

        It uses sys.stdout.write(), so no readline library is necessary.

        color ... choose from the colors below, "" means default color
        align ... left/right, left is a normal print, right is aligned on the
                  right hand side of the screen, filled with " " if necessary
        width ... the screen width
        """
        color_templates = (
            ("Black"       , "0;30"),
            ("Red"         , "0;31"),
            ("Green"       , "0;32"),
            ("Brown"       , "0;33"),
            ("Blue"        , "0;34"),
            ("Purple"      , "0;35"),
            ("Cyan"        , "0;36"),
            ("LightGray"   , "0;37"),
            ("DarkGray"    , "1;30"),
            ("LightRed"    , "1;31"),
            ("LightGreen"  , "1;32"),
            ("Yellow"      , "1;33"),
            ("LightBlue"   , "1;34"),
            ("LightPurple" , "1;35"),
            ("LightCyan"   , "1;36"),
            ("White"       , "1;37"),  )

        colors = {}

        for name, value in color_templates:
            colors[name] = value
        c_normal = '\033[0m'
        c_color = '\033[%sm'

        if align == "right":
            if self._write_pos+len(text) > width:
                # we don't fit on the current line, create a new line
                self.write("\n")
            self.write(" "*(width-self._write_pos-len(text)))

        if hasattr(self._file, 'isatty') and not self._file.isatty():
            # the stdout is not a terminal, this for example happens if the
            # output is piped to less, e.g. "bin/test | less". In this case,
            # the terminal control sequences would be printed verbatim, so
            # don't use any colors.
            color = ""
        if sys.platform == "win32" and not has_colorama:
            # Windows consoles don't support ANSI escape sequences
            color = ""

        if self._line_wrap:
            if text != "" and text[0] != "\n":
                self._file.write("\n")

        if color == "":
            self._file.write(text)
        else:
            self._file.write("%s%s%s" % (c_color % colors[color], text, c_normal))
        sys.stdout.flush()
        l = text.rfind("\n")
        if l == -1:
            self._write_pos += len(text)
        else:
            self._write_pos = len(text)-l-1
        self._line_wrap = self._write_pos >= width
        self._write_pos %= width

class Py2JsTestResult(unittest.TestResult):

  def __init__(self, *a, **k):
    super(Py2JsTestResult, self).__init__(*a, **k)
    self.__writer = Writer(a[0])
    self.__faild = False

  def startTest(self, test):
    super(Py2JsTestResult, self).startTest(test)
    test.reportProgres = self.addProgress
    self.__writer.write(str(test))
    self.__state = "[Error]"
    self.__color = "Red"

  def stopTest(self, test):
    super(Py2JsTestResult, self).stopTest(test)
    self.__writer.write(self.__state, align="right", color=self.__color)

  def addProgress(self, test):
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
        def reportProgres(self, test):
          pass
        def runTest(self):
            import difflib
            self.number_of_tests_cleard = 0
            commands = (
                'python "%(py_path)s" > "%(py_out_path)s" 2> "%(error)s"' % self.templ,
                'python pyjs.py --include-builtins "%(py_path)s" > "%(js_path)s" 2> "%(error)s"' % self.templ,
                'js -f "%(js_path)s" > "%(js_out_path)s" 2> "%(error)s"' % self.templ,
                )
            for cmd in commands:
                self.assertEqual(0, os.system(cmd))
                self.reportProgres(self)
            self.assertEqual(
                file(self.templ["py_out_path"]).readlines(),
                file(self.templ["js_out_path"]).readlines()
                )
            self.reportProgres(self)

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

