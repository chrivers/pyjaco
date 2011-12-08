#!/usr/bin/python

import os.path

template = """<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
  <title>Unittests</title>
  <script src="py-builtins.js" type="text/javascript"></script>
  <script src="jquery-1.6.1.js" type="text/javascript"></script>
</head>
<style type="text/css">
  body { font-family: monospace; }
  table { width: 40em; margin: 0 auto; background-color: #EEE; border-radius: 1em; padding: 1em; }
</style>
<script type="text/javascript">
  $(document).ready(function() {
    out = ""
    py_builtins.print = function() {
      var args = tuple(Array.prototype.slice.call(arguments));
      out += js(str(" ").PY$join(args));
      out += "\\n";
    };

    tests = {}
    res = {}    
    %(tests)s;
    %(res)s;

//    var X = function() { return 42; }; (function() { var X = X(); console.log(X); })();

    // COUNTER_var_ is named funny because it must not collide with
    // the namespace of any test case
    for (var COUNTER_var_ in tests) {
      out = "";
      try {
        eval("(function() {\\n" + tests[COUNTER_var_] + "})();");
        if (out == res[COUNTER_var_]) {
          $("#" + COUNTER_var_).text("OK").css('background-color', 'green');
        } else {
          $("#" + COUNTER_var_).text("FAIL").css('background-color', 'red');
          console.log(tests[i]);
          console.log(res[i]);
          console.log(out)
        }
      } catch (e) {
        $("#" + COUNTER_var_).text("CRASH").css('background-color', 'purple');
        console.log(e);
      }
    }

  });
</script>
<body>
  <table>
    <tr><th>Test name</th><th>Status</th></tr>
    %(rows)s
  </table>
</body>
</html>
"""

js = []
res = []
rows = []

import glob

def encode(s):
    return s.replace("\\", "\\\\").replace("\n", "\\n").replace('\"', '\\\"').replace('\'', '\\\'')

for x in sorted(glob.glob("tests/**/*.py")):
    if not (os.path.exists("%s.js" % x) and os.path.exists("%s.out" % x)):
        continue
    name = x.replace("/", "-").replace(".", "-").replace("_", "-")
    js.append('tests["%s"] = "%s"' % (name, encode(file("%s.js" % x).read()[24:])))
    res.append('res["%s"] = "%s"' % (name, encode(file("%s.out" % x).read())))
    rows.append("<tr><td>%s</td><td id='%s'>Not run</td></tr>" % (name, name))

print template % dict(tests = "\n".join(js), res = "\n".join(res), rows = "\n".join(rows))
