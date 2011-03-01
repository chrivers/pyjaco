module('<builtin>/sys.py', function sys_module(_) {
    _.__doc__ = "The PJs module responsible for system stuff";
    _.modules = {'sys':_}; // sys and __builtin__ won't be listed
                             // it doesn't make sense for them to be
                             // reloadable.
    _.path = ['.', '<builtin>'];
    _.exit = $m({'code':0}, function exit(code) {
        _.raise("SystemExit: sys.exit() was called with code "+code);
    });
});

