#! /usr/bin/python

import optparse
import testtools.runner
import testtools.util
import testtools.tests
from unittest import installHandler
from pyjs import BuiltinGenerator

def main():
    installHandler()
    option_parser = optparse.OptionParser(
        usage="%prog [options] [filenames]",
        description="pyjaco unittests script."
        )
    option_parser.add_option(
        "-a",
        "--run-all",
        action="store_true",
        dest="run_all",
        default=False,
        help="run all tests (including the known-to-fail)"
        )
    option_parser.add_option(
        "-x",
        "--no-error",
        action="store_true",
        dest="no_error",
        default=False,
        help="ignores error (don't display them after tests)"
        )
    option_parser.add_option(
        "-f",
        "--only-failing",
        action="store_true",
        dest="only_failing",
        default=False,
        help="run only failing tests (to check for improvements)"
        )
    options, args = option_parser.parse_args()
    
    with open("py-builtins.js", "w") as f:
        builtins = BuiltinGenerator().generate_builtins()
        f.write(builtins)
    
    runner = testtools.runner.Py2JsTestRunner(verbosity=2)
    results = None
    try:
        if options.run_all:
            results = runner.run(testtools.tests.ALL)
        elif options.only_failing:
            results = runner.run(testtools.tests.KNOWN_TO_FAIL)
        elif args:
            results = runner.run(testtools.tests.get_tests(args))
        else:
            results = runner.run(testtools.tests.NOT_KNOWN_TO_FAIL)
    except KeyboardInterrupt:
        pass
    if not options.no_error and results and results.errors:
        print
        print "errors:"
        print "  (use -x to skip this part)"
        for test, error in results.errors:
            print
            print "*", str(test), "*"
            print error

if __name__ == "__main__":
    main()
