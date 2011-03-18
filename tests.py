import test
import unittest
import glob
import os
    
test_paths = glob.glob("tests/*/*.py")
test_cases =[test.compile_and_run_file_test(test_path, os.path.basename(test_path)) for test_path in test_paths]

def load_tests(loader, standard_tests, none):
    suite = unittest.TestSuite()
    for case in test_cases:
      tests = loader.loadTestsFromTestCase(case)
      suite.addTests(tests)
    return suite
