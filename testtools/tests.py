"""module which findes tests from the test directory and convert them to
the unittest framwork classes."""

import testtools.env_tests as env_tests
import testtools.util as util
import glob
import os

KNOWN_TO_FAIL = [
                "tests/basic/nestedclass.py",
                "tests/basic/super.py",
                "tests/basic/kwargs.py",
                "tests/basic/float2int.py",
                "tests/basic/oo_inherit.py",
                "tests/basic/listcomp2.py",
                "tests/basic/del_dict.py",
                "tests/basic/del_local.py",
                "tests/basic/sumcomp.py",
                "tests/basic/del_array.py",
                "tests/basic/valueerror.py",
                "tests/basic/lambda.py",
                "tests/basic/try.py",
                "tests/basic/vargs.py",
                "tests/basic/del_attr.py",
                "tests/basic/del_global.py",
                "tests/basic/del_slice.py",
                "tests/basic/generator.py",
                "tests/basic/raise.py",

                "tests/functions/sort_cmp.py",
                "tests/functions/ne.py",
                "tests/functions/aug.py",
                "tests/functions/floatdiv.py",
                "tests/functions/sort23.py",

                "tests/errors/decorator.py",

                "tests/lists/filter.py",
                "tests/lists/reduce.py",
                "tests/lists/sum.py",
                "tests/lists/subclass.py",

                "tests/libraries/xmlwriter.py",

                "tests/modules/classname.py",
                "tests/modules/from_import.py",
                "tests/modules/import.py",
                "tests/modules/import_alias.py",
                "tests/modules/import_class.py",
                "tests/modules/import_diamond.py",
                "tests/modules/import_global.py",
                "tests/modules/import_multi.py",
                "tests/modules/module_name.py",
                "tests/modules/rng.py",

                "tests/strings/string_format_d.py",
                "tests/strings/string_format_efg.py",
                "tests/strings/string_format_i.py",
                "tests/strings/string_format_o.py",
                "tests/strings/string_format_u.py",
                "tests/strings/string_format_x.py",
                "tests/strings/ulcase.py",
                ]


def create_cases():
    """Helper function to find all tests in the test folders
    and wraping them into the corect test class"""
    test_cases = [
        env_tests.EnviromentTest
        ]

    test_paths = glob.glob("tests/test_*.py")
    test_paths.sort()
    for test_path in test_paths:
        test_cases.append(
            util.compile_file_test(test_path, os.path.basename(test_path))
            )

    test_paths = glob.glob("tests/test_*.js")
    test_paths.sort()
    for test_path in test_paths:
        test_cases.append(
            util.run_with_stdlib(test_path, os.path.basename(test_path))
            )


    test_paths = glob.glob("tests/*/*.py")
    test_paths.sort()
    for test_path in test_paths:
        if test_path.replace("\\","/") not in KNOWN_TO_FAIL:
            test_cases.append(
                util.compile_and_run_file_test(
                  test_path, 
                  os.path.basename(test_path)
                  )
                )
        else:
            test_cases.append(
                util.compile_and_run_file_failing_test(
                  test_path, 
                  os.path.basename(test_path)
                  )
                )
    return test_cases
          

def load_tests(loader, standard_tests, _search_pattern):
    """function called by the unittest framework to find tests in a module"""
    suite = standard_tests
    for case in create_cases():
        tests = loader.loadTestsFromTestCase(case)
        suite.addTests(tests)
    return suite
