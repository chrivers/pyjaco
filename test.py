import unittest
import os

def compile_and_run_file_test(file_path, file_name=None):
    file_name = file_name if file_name else file_path

    temp = {
        "py_path": file_path, 
        "py_out_path": file_path+".out",
        "js_path": file_path+".js",
        "js_out_path": file_path+".js.out",
        "diff_path": file_path+".diff",
        "name": file_name,
        }

    class CompileAndRunFile(unittest.TestCase):
        templ = temp
        def test_a_run_pyhton(self):
            self.assertEqual(0, os.system('python "%(py_path)s" > "%(py_out_path)s" ' % self.templ))
        def test_b_compile_javascript(self):
            self.assertEqual(0, os.system('python pyjs.py --include-builtins "%(py_path)s" > "%(js_path)s"' % self.templ))
        def test_c_run_javascript(self):
            self.assertEqual(0, os.system('js -f "%(js_path)s" > "%(js_out_path)s"' % self.templ))
        def test_d_check_output(self):
            self.assertEqual(0, os.system('diff "%(py_out_path)s" "%(js_out_path)s" > "%(diff_path)s"' % self.templ))
    CompileAndRunFile.__name__ = file_name
    return CompileAndRunFile

