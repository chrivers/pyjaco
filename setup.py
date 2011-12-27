from distutils.core import setup
try:
	from setuptools import setup
except:
	pass

setup(
    name = "pyjaco",
    version = "1.0.0",
    author = "Pyjaco development team",
    author_email = "developer@pyjaco.org",
    description = ("Python to JavaScript translator"),
    scripts = ["pyjs.py"],
    url = "http://pyjaco.org",
    keywords = "python javascript translator compiler",
    packages=["pyjaco", "pyjaco.compiler"],
)
