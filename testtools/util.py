"""
Module that defines Tool functions and test runners/result for use with
the unittest library.
"""
import sys
if sys.version_info < (2, 7):
    import unittest2 as unittest
else:
    import unittest
import os
import subprocess
import posixpath

def run_command(cmd):
    return subprocess.call(cmd, shell = True)

def get_posix_path(path):
    """translates path to a posix path"""
    heads = []
    tail = path
    while tail != '':
        tail, head = os.path.split(tail)
        heads.append(head)
    return posixpath.join(*heads[::-1])

def run_with_stdlib(file_path, file_name=None):
    """Creates a test that runs a js file with the stdlib."""
    file_name = file_name if file_name else file_path

    class TestStdLib(unittest.TestCase):
        """Tests js code with the stdlib"""
        templ = {
            "js_path": file_path, 
            "js_unix_path": get_posix_path(file_path), 
            "js_out_path": file_path + ".out",
            "js_error": file_path + ".err",
            "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by the test result class."""
    
        def runTest(self):
            """The actual test goes here."""
            cmd = (
                  'js -f "py-builtins.js" '
                  '-f "%(js_path)s" > "%(js_out_path)s" 2> "%(js_error)s"'
                  )% self.templ
            self.assertEqual(0, run_command(cmd))
            self.reportProgres()
        def __str__(self):
            return "%(js_unix_path)s [1]: " % self.templ

    return TestStdLib

def compile_file_test(file_path, file_name=None):
    """Creates a test that tests if a file can be compiled by python"""
    file_name = file_name if file_name else file_path
    
    class CompileFile(unittest.TestCase):
        """Test if a file can be compiled by python."""

        templ = {
            "py_executable": sys.executable,
            "py_path": file_path, 
            "py_unix_path": get_posix_path(file_path), 
            "py_out_path": file_path + ".out",
            "py_error": file_path + ".err",
            "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by the test result class"""

        def runTest(self):
            """The actual test goes here."""
            commands = (
                (
                '%(py_executable)s "%(py_path)s" > '
                '"%(py_out_path)s" 2> "%(py_error)s"'
                ) % self.templ,
              )
            for cmd in commands:
                self.assertEqual(0, run_command(cmd))
                self.reportProgres()
        def __str__(self):
            return "%(py_unix_path)s [1]: " % self.templ
    return CompileFile




def compile_and_run_file_test(file_path, file_name=None):
    """Creates a test that compiles and runs the python file as js"""
    file_name = file_name if file_name else file_path

    class CompileAndRunFile(unittest.TestCase):
        """Tests that a file can be compiled and run as js"""
        templ = {
        "py_executable": sys.executable,
        "py_path": file_path, 
        "py_unix_path": get_posix_path(file_path),
        "py_out_path": file_path + ".out",
        "js_path": file_path + ".js",
        "js_out_path": file_path + ".js.out",
        "py_error": file_path + ".err",
        "js_error": file_path + ".js.err",
        "compiler_error": file_path + ".comp.err",
        "name": file_name,
        }
        def reportProgres(self):
            """Should be overloaded by the test result class"""

        def runTest(self):
            """The actual test goes here."""
            mtime_src = os.path.getmtime(self.templ['py_path'])
            try:
                mtime_py_res = os.path.getmtime(self.templ['py_out_path'])
            except OSError:
                mtime_py_res = 0
            python_command = (
                '%(py_executable)s "%(py_path)s" > "%(py_out_path)s" 2> '
                '"%(py_error)s"'
                ) % self.templ

            try:
                mtime_js_res = os.path.getmtime(self.templ['js_path'])
            except OSError:
                mtime_js_res = 0
            compile_command = (
                '%(py_executable)s pyjs.py -I -q '
                '"%(py_path)s" > "%(js_path)s" 2> '
                '"%(compiler_error)s"'
                ) % self.templ 

            javascript_command = (
                'js -f "%(js_path)s" > "%(js_out_path)s" 2> '
                '"%(js_error)s"' 
                ) % self.templ

            commands = []
            if mtime_py_res < mtime_src:
                commands.append(python_command)
            if mtime_js_res < mtime_src:
                commands.append(compile_command)
            commands.append(javascript_command)

            for cmd in commands:
                self.assertEqual(0, run_command(cmd))
                self.reportProgres()
            self.assertEqual(
                file(self.templ["py_out_path"]).readlines(),
                file(self.templ["js_out_path"]).readlines()
                )
            self.reportProgres()

        def __str__(self):
            return "%(py_unix_path)s: " % self.templ

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

