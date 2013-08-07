/**
  Copyright 2011-2013 Christian Iversen <chrivers@iversen-net.dk>

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
**/

__builtins__.PY$credits = function(obj) {
    print($PY.repr(__builtins__.PY$credits));
};

__builtins__.PY$credits.PY$__repr__ = function(obj) {
    return str("The Pyjaco authors would like to thank everybody who has contributed time, ideas, or patches to the Pyjaco project.");
};

__builtins__.PY$help = function() {
    __builtins__.PY$print("Welcome to pyjaco, the Python-to-Javascript compiler!\n" +
                          "  Homepage     : pyjaco.org\n" +
                          "  Github       : https://github.com/chrivers/pyjaco\n" +
                          "  Email        : developer@pyjaco.org\n" +
                          "  Google group : http://groups.google.com/group/pyjaco");
};
__builtins__.PY$help.PY$__repr__ = function(obj) {
    return str("Type help() for interactive help, or help(object) for help about object.");
};

__builtins__.PY$license = function() {
    return __builtins__.PY$str("Copyright 2011-2013, Christian Iversen et. al. See the file LICENSE in the pyjaco distribution for details.");
};
__builtins__.PY$license.PY$__repr__ = function(obj) {
    return str("Type license() to see the full license text");
};

__builtins__.PY$copyright = __builtins__.PY$license;
