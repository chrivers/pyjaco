from distutils.core import setup
try:
	from setuptools import setup
except:
	pass
from _version import get_version, version_file

version = get_version()

setup(
    name = "pyjaco",
    version = version,
    author = "Pyjaco development team",
    author_email = "developer@pyjaco.org",
    description = ("Python to JavaScript translator"),
    scripts = ["pyjs.py"],
    url = "http://pyjaco.org",
    keywords = "python javascript translator compiler",
    packages=["pyjaco", "pyjaco.compiler"],
    package_data={"pyjaco": ["stdlib/*.js"]},
    data_files = [("pyjaco", [version_file, "_version.py"])],
)
