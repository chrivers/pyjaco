/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
  Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
  Copyright 2011 Christian Iversen <ci@sikkerhed.org>

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

var slice = __inherit(object, "slice");

__builtins__.PY$slice = slice;

slice.PY$__init__ = function(self, start, stop, step) {
    if (stop === undefined && step === undefined)
    {
        stop = start;
        start = null;
    }
    if (!start && start != 0) start = null;
    if (stop === undefined) stop = null;
    if (step === undefined) step = null;
    self.start = js(start);
    self.stop = js(stop);
    self.step = js(step);
};

slice.PY$__str__ = function(self) {
    return str("slice(" + self.start + ", " + self.stop + ", " + self.step + ")");
};

slice.PY$indices = function(self, n) {
    n = js(n);
    var start = self.start;
    if (start === null)
        start = 0;
    if (start > n)
        start = n;
    if (start < 0)
        start = n+start;
    var stop = self.stop;
    if (stop > n)
        stop = n;
    if (stop === null)
        stop = n;
    if (stop < 0)
        stop = n+stop;
    var step = self.step;
    if (step === null)
        step = 1;
    return tuple([start, stop, step]);
};
