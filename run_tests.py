#! python
import optparse
import testtools.runner
import testtools.util
import testtools.tests
def main():
    option_parser = optparse.OptionParser(
        usage="%prog [options] [filenames]",
        description="py2js unittests script."
        )
    option_parser.add_option(
        "-a",
        "--run-all",
        action="store_true",
        dest="run_all",
        default=False,
        help="run all tests (including the known-to-fail)"
        )
    options, args = option_parser.parse_args()
    runner = testtools.runner.Py2JsTestRunner(verbosity=2)
    if options.run_all:
        runner.run(testtools.tests.ALL)
    elif args:
        runner.run(testtools.tests.get_tests(args))
    else:
        runner.run(testtools.tests.NOT_KNOWN_TO_FAIL)

if __name__ == "__main__":
  main()
