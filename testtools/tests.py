"""module which finds tests from the test directory and converts them to
the unittest framework classes."""

import testtools.env_tests as env_tests
import testtools.known_to_fail as known_to_fail
import testtools.util as util
import unittest
import glob
import os

def create_cases():
    """Helper function to find all tests in the test folders
    and wrapping them into the correct test class"""

    test_cases = unittest.TestSuite()
    test_cases.addTest(
        unittest.TestLoader().loadTestsFromTestCase(
            env_tests.EnviromentTest
            )
        )

    failing_test_cases = unittest.TestSuite()

    test_paths = glob.glob("tests/test_*.py")
    test_paths.sort()
    for test_path in test_paths:
        test_cases.addTest(
            unittest.TestLoader().loadTestsFromTestCase(
                util.compile_file_test(test_path, os.path.basename(test_path))
                )
            )

    test_paths = glob.glob("tests/test_*.js")
    test_paths.sort()
    for test_path in test_paths:
        test_cases.addTest(
            unittest.TestLoader().loadTestsFromTestCase(
                util.run_with_stdlib(test_path, os.path.basename(test_path))
                )
            )

    test_paths = glob.glob("tests/*/*.py")
    test_paths.sort()
    for test_path in test_paths:
        if (
            test_path.replace("\\","/") not 
            in known_to_fail.KNOWN_TO_FAIL
            ):
            test_cases.addTest(
                unittest.TestLoader().loadTestsFromTestCase(
                    util.compile_and_run_file_test(
                        test_path, 
                        os.path.basename(test_path)
                        )
                    )
                )
        else:
            failing_test_cases.addTest(
                unittest.TestLoader().loadTestsFromTestCase(
                    util.compile_and_run_file_failing_test(
                        test_path, 
                        os.path.basename(test_path)
                        )
                    )
                )
    return test_cases , failing_test_cases

NOT_KNOWN_TO_FAIL, KNOWN_TO_FAIL = create_cases()
ALL = unittest.TestSuite((NOT_KNOWN_TO_FAIL, KNOWN_TO_FAIL))

def get_tests(names):
    """filters out all tests that don't exist in names and
    adds them to a new test suite"""
    def flatten(itr):
        """tries to flatten out a suite to the individual tests"""
        import itertools
        try:
            return itertools.chain.from_iterable(flatten(item) for item in iter)
        except TypeError:
            return itertools.chain(*itr)

    return_suite = unittest.TestSuite()
    return_suite.addTest(
        unittest.TestLoader().loadTestsFromTestCase(
            env_tests.EnviromentTest
            )
        )
    for suite in flatten(iter(ALL)):
        test_name = str(suite._tests[0])
        if any(True for name in names if name in test_name):
            return_suite.addTest(suite)
    return return_suite

def load_tests(_loader, standard_tests, _search_pattern):
    """function called by the unittest framework to find tests in a module"""
    suite = standard_tests
    suite.addTests(ALL)
    return suite
