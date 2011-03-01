module('<builtin>/os/path.py', function os_path_module(_) {
    _.__doc__ = "a module for dealing with paths";
    _.join = $m({}, true, function join(first, args) {
        first = $b.js(first);
        args = $b.js(args);
        var path = first;
        for (var i=0;i<args.length;i++) {
            args[i] = $b.js(args[i]);
            if (_.isabs(args[i])) {
                path = args[i];
            } else if (path === '' || '/\\:'.indexOf(path.slice(-1)) !== -1) {
                path += args[i];
            } else
                path += '/' + args[i];
        }
        return $b.str(path);
    });
    _.isabs = $m(function isabs(path) {
        path = $b.js(path);
        if (!path)return false;
        return path && path[0] == '/';
    });
    _.abspath = $m(function abspath(path) {
        path = $b.js(path);
        if (!_.isabs(path))
            _.raise("not implementing this atm");
        return _.normpath(path);
    });
    _.dirname = $m(function dirname(path) {
        path = $b.js(path);
        return $b.str(path.split('/').slice(0,-1).join('/') || '/');
    });
    _.basename = $m(function basename(path) {
        path = $b.js(path);
        return $b.str(path.split('/').slice(-1)[0]);
    });
    _.normpath = $m(function normpath(path) {
        path = $b.js(path);
        var prefix = path.match(/^\/+/) || '';
        var comps = path.slice(prefix.length).split('/');
        var i = 0;
        while (i < comps.length) {
            if (comps[i] == '.')
                comps = comps.slice(0, i).concat(comps.slice(i+1));
            else if (comps[i] == '..' && i > 0 && comps[i-1] && comps[i-1] != '..') {
                comps = comps.slice(0, i-1).concat(comps.slice(i+1));
                i -= 1;
            } else if (comps[i] == '' && i > 0 && comps[i-1] != '') {
                comps = comps.slice(0, i).concat(comps.slice(i+1));
            } else
                i += 1
        }
        if (!prefix && !comps)
            comps.push('.');
        return $b.str(prefix + comps.join('/'));
    });
});

