
all: stdlib
	$(MAKE) -C examples generate

stdlib:
	@./generate_library.py

clean:
	@rm -fv py-builtins.js *~ library/*~ *.pyc
	$(MAKE) -C examples clean

examples:
	$(MAKE) -C examples generate

lint:
	pylint --rcfile=pylint.conf py2js

jslint:
	jsl py-builtins.js
