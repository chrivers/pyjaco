from os.path import join, dirname
from platform import system, version
from re import findall, match, IGNORECASE
from subprocess import Popen, PIPE

version_file = join(dirname(__file__),'VERSION')

class GITExecutable(object):
    """
        Attempts to find git.
        Returns the best guess
        at the path for a git
        executable.
    """
    def __new__(self):
        cmd = 'which'
        if system() == 'Windows':
            try:
                major, minor = [int(x) for x in version().split('.',2)[0:2]]
                # version number information
                # http://msdn.microsoft.com/en-us/library/ms724834%28v=VS.85%29.aspx
                # (6, 0) is Vista or Windows Server 2008
                # (6, 1) is Windows 7 or Server 2008 RC2
                if (major, minor) > (6, 0):
                    # Windows 7 brings the 
                    # where command with
                    # functionality similar
                    # to which on unix.
                    cmd = 'where'
            except:
                pass
        try:
            p = Popen([cmd, 'git'], stdout=PIPE, stderr=PIPE)
            p.stderr.close()
            path = p.stdout.next().strip()
        except:
            path = None
        return path or 'git'

GIT_EXECUTABLE = GITExecutable()

def get_version():
    file_version = get_file_version()
    version = get_repo_version() or file_version
    if version is None:
        raise ValueError('Could not determine version.')
    if version != file_version:
        put_file_version(version)
    return version

def get_file_version():
    try:
        with open(version_file, 'rb') as fp:
            version = fp.next().strip()
    except:
        version = None
    return version

def put_file_version(version):
    with open(version_file, 'wb') as fp:
        fp.write(version)

def get_repo_version():
    """
        Repo tags are assumed to be in the format:
            vMajor.Minor
        
        Example:
            v0.1
        
        Function returns a version string of the form:
            vMajor.Minor.PatchHash
        
        Example:
            v0.1.1gc58ec0d
    """
    try:
        p = Popen([GIT_EXECUTABLE, 'describe'], stdout=PIPE, stderr=PIPE)
        p.stderr.close()
        parts = findall('[a-zA-Z0-9]+',p.stdout.next().strip())
        if parts:
            version = "%s.%s" % (parts[0],parts[1])
            if len(parts) > 2:
                version = "%s.%s%s" % (version,parts[2],parts[3])
            else:
                version = "%s.0" % version
        else:
            raise ValueError('git describe did not return a valid version string.')
    except:
        version = None
    return version

def parse_version(version):
    """
        input version string of the form:
            'vMajor.Minor.PatchHash'
        like:
            'v0.1.5g95ffef4'
            ------ or ------
            'v0.1.0'
            
        returns version_info tuple of the form:
            (major,minor,patch,hash)
        like:
            (0, 1, 5, '95ffef4')
            -------- or --------
            (0, 1, 0, '')
    """
    matches = match(
        'v(?P<major>[0-9]+)\.(?P<minor>[0-9]+)\.(?P<patch>[0-9]+)(g(?P<hash>[a-z0-9]*))?',
        version,
        IGNORECASE
    )
    if matches:
        major = int(matches.group('major'))
        minor = int(matches.group('minor'))
        patch = int(matches.group('patch'))
        hash = matches.group('hash') or ''
        return (major,minor,patch,hash)
    else:
        raise ValueError("Version string, '%s' could not be parsed.  It should be of the form: 'vMajor.Minor.PatchHash'." % version)

if __name__ == '__main__':
    print get_version()