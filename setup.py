from distutils.core import setup
try:
	from setuptools import setup
except:
	pass

setup(
    name = "pyjaco",
    version = "1.0.0",
    author = "Mateusz Paprocki",
    author_email = "mattpap@gmail.com",
    description = ("Python to JavaScript translator"),
    url = "http://pyjaco.org",
    keywords = "python javascript translator compiler",
    packages=["pyjaco", "pyjaco.compiler"],
)
