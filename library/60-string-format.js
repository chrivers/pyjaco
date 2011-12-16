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

    var get_argument = function() {
        if (flag_name) {
            return args.PY$__getitem__(flag_name);
        } else {
            return args.PY$__getitem__(argc++);
        }
    };
    var fixed_digits = function(num, digits) {
        if (digits > 0 && digits < num.length) {
            if (num.charAt(digits) >= "5") {
                return num.substring(0, digits-1) + (parseInt(num.charAt(digits-1)) + 1).toString();
            } else {
                return num.substring(0, digits);
            }
        } else {
            return num;
        }
    };
    var format_float = function(num, defprec, prec) {
        if (prec < 1) {
            prec = defprec;
        }
        var parts = num.toFixed(prec+1).split(".");
        if (prec > defprec) {
            return parts[0] + "." + parts[1].substring(0, prec);
        } else {
            return parts[0] + "." + fixed_digits(parts[1], prec);
        }
    };
    var format_exp = function(num, expchar, defprec, prec, drop_empty_exp) {
        var parts = num.toExponential(defprec).split("e");
        if (parts[1].length < 3) {
            parts[1] = parts[1].charAt(0) + "0" + parts[1].substring(1);
        }
        if (prec) {
            var decparts = parts[0].split(".");
            decparts[1] = fixed_digits(decparts[1], prec);
            parts[0] = decparts[0] + "." + decparts[1];
        }
        if (drop_empty_exp && parts[1] === "+00") {
            return parts[0];
        } else {
            return parts[0] + expchar + parts[1];
        }
    };
    var trim_trailing_zeroes = function(s) {
        var i = s.length - 1;
        while (s.charAt(i) === '0') {
            i--;
        }
        s = s.substr(0, i + 1);
        if (s.charAt(s.length - 1) === '.') {
            s = s.substr(0, s.length - 1);
        }
        return s;
    };

    var s = js(obj);
    var i = 0;
    var res = "";
    var argc = 0;
    var si;
    if ($PY.isinstance(args, [dict, list, tuple]) === false) {
        args = tuple([args]);
    }
    while (i < s.length) {
        si = s.charAt(i);
        if (si === "%") {
            if (++i === s.length) {
                throw py_builtins.ValueError("Incomplete format");
            }

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
            while (i < s.length) {
                si = s.charAt(i);
                if (si === "0") {
                    flag_zero = true;
                } else if (si === "-") {
                    flag_minus = true;
                } else if (si === "#") {
                    flag_hash = true;
                } else if (si === "0") {
                    flag_zero = true;
                } else if (si === " ") {
                    flag_space = true;
                } else if (si === "+") {
                    flag_space = false;
                    flag_plus  = true;
                } else if (si > "0" && si <= "9") {
                    flag_len = "";
                    while (si >= "0" && si <= "9") {
                        flag_len += si;
                        si = s.charAt(++i);
                    }
                    flag_len = Number(flag_len);
                    i--;
                } else if (si === ".") {
                    si = s.charAt(++i);
                    while (si >= "0" && si <= "9") {
                        flag_len2 += si;
                        si = s.charAt(++i);
                    }
                    flag_len2 = Number(flag_len2);
                    i--;
                } else if (si === "(") {
                    flag_name = "";
                    while (i++ < s.length) {
                        si = s.charAt(i);
                        if (si === ")") {
                            break;
                        }
                        flag_name += si;
                    }
                } else if (si === "%") {
                    subres = "%";
                } else if (si === "d" || si === "i" || si === "u") {
                    has_sign = true;
                    subres = js(int(get_argument())).toString();
                } else if (si === "s") {
                    subres = js(get_argument().PY$__str__());
                } else if (si === "r") {
                    subres = js(get_argument().PY$__repr__());
                } else if (si === "f" || si === "F") {
                    has_sign = true;
                    subres = format_float(js(get_argument().PY$__float__()), 6, flag_len2);
                } else if (si === "e" || si === "E") {
                    has_sign = true;
                    var expchar = si;
                    subres = format_exp(js(get_argument().PY$__float__()), expchar, 6, flag_len2, false);
                } else if (si === "g" || si === "G") {
                    has_sign = true;
                    var arg = js(get_argument().PY$__float__());

                    var val = flag_len2;
                    if (val === 0)
                        val = 6;

                    if (arg === 0 && !flag_hash) {
                        subres = "0";
                    } else if (arg < 0.0001 || arg.toFixed().split(".")[0].length > val) {
                        expchar = "e";
                        if (si === "G")
                            expchar = "E";
                        subres = format_exp(arg, expchar, 5, flag_len2-1, true);

                        if (!flag_hash) {
                            var parts = subres.split(expchar);
                            subres = trim_trailing_zeroes(parts[0]);
                            if (parts[1]) {
                                subres += expchar + parts[1];
                            }
                        }
                    } else {
                        subres = format_float(arg, 5, flag_len2-1);
                        if (!flag_hash) {
                            subres = trim_trailing_zeroes(subres);
                        }
                    }
                } else if (si === "o") {
                    has_sign = true;
                    subres = js(get_argument().PY$__int__()).toString(8);
                    if (flag_hash && subres.charAt(0) !== "0")
                        prefix = "0";
                } else if (si === "x") {
                    has_sign = true;
                    if (flag_hash)
                        prefix = "0x";
                    subres = js(get_argument().PY$__int__()).toString(16);
                } else if (si === "X") {
                    has_sign = true;
                    if (flag_hash)
                        prefix = "0X";
                    subres = js(get_argument().PY$__int__()).toString(16).toUpperCase();
                } else {
                    throw py_builtins.ValueError("Unsupported format character '" + si + "' at index " + String(i));
                }
                i++;
                if (subres != null)
                    break;
            }
            var pad_char = " ";
            if (flag_zero)
                pad_char = "0";
            var sign = "";
            if (has_sign) {
                if (subres.charAt(0) === "-" || subres.charAt(0) === "+") {
                    sign = subres.charAt(0);
                    subres = subres.substring(1);
                } else if (flag_plus) {
                    sign = "+";
                }
            }
            if (flag_space) {
                prefix = " " + prefix;
            }
            if (pad_char === " x") {
                prefix = sign + prefix;
                sign = "";
            }
            var pad = "";
            for (var c = sign.length + prefix.length + subres.length; c < flag_len; c++)
                pad = pad + pad_char;
            if (flag_minus) {
                res += sign + prefix + subres + pad;
            } else {
                if (flag_zero) {
                    res += sign + pad + prefix + subres;
                } else {
                    res += pad + sign + prefix + subres;
                }
            }
         } else {
             res += si;
             i++;
        }
    }
    return res;
}
