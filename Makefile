SHELL=/bin/zsh -G

all: stdlib
	$(MAKE) -C examples generate

stdlib:
	@./generate_library.py

clean: testclean
	@rm -fv py-builtins.js *~ library/*~ *.pyc
	$(MAKE) -C examples clean

testclean:
	@rm -f tests/**/*.py.js.out
	@rm -f tests/**/*.py.err
	@rm -f tests/**/*.py.js
	@rm -f tests/**/*.py.out
	@rm -f tests/**/*.pyjs.err
	@rm -f tests/**/*.py.comp.err
	@rm -f tests/test_builtins.js.{err,out}

examples:
	$(MAKE) -C examples generate

lint:
	pylint --rcfile=pylint.conf py2js

jslint:
	jsl py-builtins.js
