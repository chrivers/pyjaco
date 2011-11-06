/**
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

function sprintf(obj, args) {
    var s = js(obj);
    var i = 0;
    var res = "";
    var argc = 0;
    if (!js(isinstance(args, tuple.__call__([dict, list, tuple])))) {
        args = tuple.__call__([args]);
    }
    while (i < s.length) {
        if (s[i] == "%") {
            i++;
            var flag_zero  = false;
            var flag_minus = false;
            var flag_hash  = false;
            var flag_len   = 0;
            var subres     = null;
            var prefix     = "";
            var fix_minus  = false;
            while (i < s.length) {
                if (s[i] == "0") {
                    flag_zero = true;
                    i++;
                    continue;
                } else if (s[i] == "-") {
                    flag_minus = true;
                    i++;
                    continue;
                } else if (s[i] == "#") {
                    flag_hash = true;
                    i++;
                    continue;
                } else if (s[i] > "0" && s[i] <= "9") {
                    flag_len = "";
                    while (s[i] >= "0" && s[i] <= "9") {
                        flag_len += s[i];
                        i++;
                    }
                    flag_len = Number(flag_len);
                    continue;
                } else if (s[i] == "d") {
                    fix_minus = true;
                    subres = js(args.__getitem__([argc++]).__int__());
                    i++;
                    break;
                } else if (s[i] == "s") {
                    subres = js(args.__getitem__([argc++]).__str__());
                    i++;
                    break;
                } else if (s[i] == "x") {
                    fix_minus = true;
                    if (flag_hash)
                        prefix = "0x";
                    subres = js(args.__getitem__([argc++]).__int__()).toString(16);
                    i++;
                    break;
                } else if (s[i] == "X") {
                    fix_minus = true;
                    if (flag_hash)
                        prefix = "0X";
                    subres = js(args.__getitem__([argc++]).__int__()).toString(16).toUpperCase();
                    i++;
                    break;
                } else {
                    throw py_builtins.ValueError.__call__("Unsupported format character '" + s[i] + "' at index " + String(i));
                }
            }
            var pad_char = " ";
            if (flag_zero)
                pad_char = "0";
            var minus = "";
            if (fix_minus) {
                if (subres[0] == "-") {
                    minus = "-";
                    subres = subres.substring(1);
                }
            }
            if (flag_minus) {
                for (var c = subres.length + minus.length; c < flag_len; c++)
                    subres = subres + pad_char;
            } else {
                for (var c = subres.length + minus.length; c < flag_len; c++)
                    subres = pad_char + subres;
            }
            res += minus + prefix + subres;
         } else {
            res += s[i++];
        }
    }
    return res;
}
