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
            var flag_plus  = false;
            var flag_space = false;
            var flag_len   = 0;
            var flag_len2  = 0;
            var subres     = null;
            var prefix     = "";
            var has_sign  = false;
            var flag_name  = null;
            var get_argument = function() {
                if (flag_name) {
                    return args.__getitem__(flag_name);
                } else {
                    return args.__getitem__(argc++);
                }
            };
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
                } else if (s[i] == "0") {
                    flag_zero = true;
                    i++;
                    continue;
                } else if (s[i] == " ") {
                    flag_space = true;
                    i++;
                    continue;
                } else if (s[i] == "+") {
                    flag_space = false;
                    flag_plus  = true;
                    i++;
                    continue;
                } else if (s[i] > "0" && s[i] <= "9") {
                    flag_len = "";
                    while (s[i] >= "0" && s[i] <= "9") {
                        flag_len += s[i];
                        i++;
                    }
                    if (s[i] == ".") {
                        i++;
                        while (s[i] >= "0" && s[i] <= "9") {
                            flag_len2 += s[i];
                            i++;
                        }
                    }
                    flag_len = Number(flag_len);
                    flag_len2 = Number(flag_len2);
                    continue;
                } else if (s[i] == "(") {
                    flag_name = "";
                    while (i++ < s.length) {
                        if (s[i] == ")") {
                            break;
                        }
                        flag_name += s[i];
                    }
                    i++;
                } else if (s[i] == "d" || s[i] == "i" || s[i] == "u") {
                    has_sign = true;
                    subres = js(get_argument().__int__()).toString();
                    i++;
                    break;
                } else if (s[i] == "s") {
                    subres = js(get_argument().__str__());
                    i++;
                    break;
                } else if (s[i] == "f" || s[i] == "F") {
                    has_sign = true;
                    subres = js(get_argument().__str__());
                    i++;
                    break;
                } else if (s[i] == "e" || s[i] == "E") {
                    has_sign = true;
                    var expchar = s[i];
                    var parts = js(get_argument().__float__()).toExponential(6).split("e");
                    if (parts[1].length < 3) {
                        parts[1] = parts[1][0] + "0" + parts[1].substring(1);
                    }
                    if (flag_len2) {
                        var decparts = parts[0].split(".");

                        if (flag_len2 < decparts[1].length) {
                            if (decparts[1][flag_len2] >= "5") {
                                decparts[1] = decparts[1].substring(0, flag_len2-1) + (parseInt(decparts[1][flag_len2-1])+1).toString();
                            } else {
                                decparts[1] = decparts[1].substring(0, flag_len2);
                            }
                        }
                        parts[0] = decparts[0] + "." + decparts[1].substring(0, flag_len2);
                    }
                    subres = parts[0] + expchar + parts[1];
                    i++;
                    break;
                } else if (s[i] == "g" || s[i] == "G") {
                    subres = "NOT IMPLEMENTED";
                    i++;
                    break;
                } else if (s[i] == "o") {
                    has_sign = true;
                    subres = js(get_argument().__int__()).toString(8);
                    if (flag_hash && subres[0] !== "0")
                        prefix = "0";
                    i++;
                    break;
                } else if (s[i] == "x") {
                    has_sign = true;
                    if (flag_hash)
                        prefix = "0x";
                    subres = js(get_argument().__int__()).toString(16);
                    i++;
                    break;
                } else if (s[i] == "X") {
                    has_sign = true;
                    if (flag_hash)
                        prefix = "0X";
                    subres = js(get_argument().__int__()).toString(16).toUpperCase();
                    i++;
                    break;
                } else {
                    throw py_builtins.ValueError.__call__("Unsupported format character '" + s[i] + "' at index " + String(i));
                }
            }
            var pad_char = " ";
            if (flag_zero)
                pad_char = "0";
            var sign = "";
            if (has_sign) {
                if (subres[0] == "-" || subres[0] == "+") {
                    sign = subres[0];
                    subres = subres.substring(1);
                } else if (flag_plus) {
                    sign = "+";
                }
            }
            if (flag_space) {
                prefix = " " + prefix;
            }
            if (flag_minus) {
                for (var c = sign.length + prefix.length + subres.length; c < flag_len; c++)
                    subres = subres + pad_char;
            } else {
                for (var c = sign.length + prefix.length + subres.length; c < flag_len; c++)
                    subres = pad_char + subres;
            }
            res += sign + prefix + subres;
         } else {
            res += s[i++];
        }
    }
    return res;
}
