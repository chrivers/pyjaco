
all: stdlib
	$(MAKE) -C examples generate

stdlib:
	@cat library/*.js > py-builtins.js

clean:
	@rm -fv py-builtins.js *~ library/*~ *.pyc
	$(MAKE) -C examples clean

examples:
	$(MAKE) -C examples generate

lint:
	pylint --rcfile=pylint.conf py2js

jslint:
	jsl py-builtins.js