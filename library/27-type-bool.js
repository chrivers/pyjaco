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

var bool = __inherit(object, "bool");

var __py2jsbool = bool;

bool.prototype.__init__ = function(b) {
    if (b) {
        this._obj = true;
    } else {
        this._obj = false;
    }
};

bool.prototype.__bool__ = function () {
    return this._obj;
};

bool.prototype.__str__ = function () {
    if (this._obj) {
        return str.__call__("True");
    } else {
        return str.__call__("False");
    }
};

bool.prototype.toString = function () {
    if (this._obj) {
        return "1";
    } else {
        return "";
    }
};

bool.prototype.__repr__ = bool.prototype.__str__;

bool.prototype.__eq__ = function (other) {
    if (other.__class__ !== this.__class__)
        return False;

    return bool.__call__(this._obj === other._obj);
};

bool.prototype._js_ = function () {
    return this._obj;
};

bool.prototype.__neg__ = function() {
    return bool.__call__(!this._obj);
};

bool.prototype.__nonzero__ = function() {
    return bool.__call__(this._obj);
};

bool.prototype.__and__ = function(x) {
    if (this._obj) {
        return x;
    } else {
        return this;
    }
};

bool.prototype.__or__ = function(x) {
    if (this._obj) {
        return this;
    } else {
        return x;
    }
};

bool.prototype.__int__ = function(x) {
    if (this._obj) {
        return $c1;
    } else {
        return $c0;
    }
};

var True = bool.__call__(true);
var False = bool.__call__(false);

bool.__call__ = function(b) {
    if (b) {
        return True;
    } else {
        return False;
    }
};
