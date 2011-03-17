import unittest

class Py2JsLoader(unittest.TestLoader):
    def getTestCaseName(self, test_case):
        posible = [
            run_pyhton,
            compile_javascript,
            run_javascript,
            check_output
            ]
        return filter(lambda x: hasattr(test_case, x), posible)

def compile_and_run_file_test(file_path, file_name=None):
    file_name = file_name if file_name else file_path
    templ = {"path": file_path, "name": file_name}
    class CompileAndRunFile(TestCase):
      file_path = file_path
      file_name = file_name
      def run_pyhton(self):
          self.assertTrue(os.system('python "%(path)s" > "%(path)s.out" ' % templ))
      def compile_javascript(self):
          self.assertTrue(os.system('python py2js.py --inclue-builtins "%(path)s" > "%(path)s.js"' % templ))
      def run_javascript(self):
          self.assertTrue(os.system('js -f "%(path)s.js" > "%(path)s.js.out"' % templ))
      def check_output(self):
          self.assertTrue(os.system('diff "%(path)s.oyt" > "%(path)s.js.out"' % templ))
