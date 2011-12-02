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
<style>
  body { font-family: monospace; }
  table { width: 40em; margin: 0 auto; background-color: #EEE; border-radius: 1em; padding: 1em; }
  
</style>
<script type="text/javascript">
  $(document).ready(function() {
    out = ""
    py_builtins.print = function() {
      var args = tuple(Array.prototype.slice.call(arguments));
      out += str(" ").PY$join(args);
      out += "\\n";
    };

    tests = {}
    res = {}    
    %(tests)s;
    %(res)s;

    for (var i in tests) {
      out = "";
      try {
        eval("(function() {" + tests[i] + "})();");
        if (out == res[i]) {
          $("#" + i).text("OK").css('background-color', 'green');
        } else {
          console.log(tests[i]);
          console.log(res[i]);
          console.log(out)
          $("#" + i).text("FAIL").css('background-color', 'red');
        }
      } catch (e) {
        $("#" + i).text("CRASH").css('background-color', 'purple');
        console.log(e);
      }
    }
/*
    if (out == exp) {
      $("#status-basic-sqrt-py").text("OK").css('background-color', 'green');
    } else {
      $("#status-basic-sqrt-py").text("FAIL").css('background-color', 'red');
    }
*/
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
    #.encode('string_escape').replace("\"", "\\\"")
    #.encode('string_escape').replace("\"", "\\\"").replace("\\\\", "\\\\\\\\").replace("\n", "\\\n")
#    return s.encode('string_escape').replace('\"', '\\\"')
    return s.replace("\\", "\\\\").replace("\n", "\\n").replace('\"', '\\\"').replace('\'', '\\\'')

for x in glob.glob("tests/**/*.py"):
    if not (os.path.exists("%s.js" % x) and os.path.exists("%s.out" % x)):
        continue
    name = x.replace("/", "-").replace(".", "-").replace("_", "-")
#    js.append('tests["%s"] = "%s"' % (name, file("%s.js" % x).read()[24:].encode('base64').replace("\n", "")))
#    res.append('res["%s"] = "%s"' % (name, file("%s.out" % x).read().encode('base64').replace("\n", "")))
    js.append('tests["%s"] = "%s"' % (name, encode(file("%s.js" % x).read()[24:])))
    res.append('res["%s"] = "%s"' % (name, encode(file("%s.out" % x).read())))
    rows.append("<tr><td>%s</td><td id='%s'>Not run</td></tr>" % (name, name))

print template % dict(tests = "\n".join(js), res = "\n".join(res), rows = "\n".join(rows))
