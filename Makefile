
all:
	@cat library/*.js > py-builtins.js
	$(MAKE) -C examples generate

clean:
	@rm -fv py-builtins.js *~ library/*~ *.pyc
	$(MAKE) -C examples clean

examples:
	$(MAKE) -C examples generate
