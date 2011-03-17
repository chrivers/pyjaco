import unittest

class Py2JsLoader(unittest.TestLoader):
    def getTestCaseName(self, test_case):
        return []

def compile_and_run_file_test(file_path):
  class CompileAndRunFile(TestCase):
    def run_pyhton(self):
      pass
    def compile_javascript(self):
      pass
    def run_javascript(self):
      pass
    def check_output(self):
      pass
