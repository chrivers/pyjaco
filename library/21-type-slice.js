/* Python 'slice' object */

var slice = __inherit(object, "slice");

slice.prototype.__init__ = function(start, stop, step) {
    if (!defined(stop) && !defined(step))
    {
        stop = start;
        start = null;
    }
    if (!start && start != 0) start = null;
    if (!defined(stop)) stop = null;
    if (!defined(step)) step = null;
    this.start = js(start);
    this.stop = js(stop);
    this.step = js(step);
};

slice.prototype.__str__ = function() {
    return str("slice(" + this.start + ", " + this.stop + ", " + this.step + ")");
};

slice.prototype.indices = Function(function(n) {
    n = js(n);
    var start = this.start;
    if (start === null)
        start = 0;
    if (start > n)
        start = n;
    if (start < 0)
        start = n+start;
    var stop = this.stop;
    if (stop > n)
        stop = n;
    if (stop === null)
        stop = n;
    if (stop < 0)
        stop = n+stop;
    var step = this.step;
    if (step === null)
        step = 1;
    return tuple.__call__([start, stop, step]);
});
