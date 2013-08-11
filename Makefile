SHELL=/bin/zsh -G

all: stdlib
	$(MAKE) -C examples generate

stdlib: py-builtins.js

py-builtins.js:
	@./pyjs.py -b generate --output .

clean: testclean
	@rm -fv **/*~ **/*.pyc 1.{pyres,jsres,js}
	$(MAKE) -C examples clean

testclean:
	@rm -f tests/**/*.py.js.out
	@rm -f tests/**/*.py.js
	@rm -f tests/**/*.py.js.err
	@rm -f tests/**/*.py.comp.err

testclean-full: testclean
	@rm -f tests/**/*.py.err
	@rm -f tests/**/*.py.out
	@rm -f tests/**/*.pyc
	@rm -f tests/test_builtins.js.{err,out}

examples:
	$(MAKE) -C examples generate

lint:
	pylint --rcfile=pylint.conf pyjaco

jslint:
	jsl py-builtins.js

install:
	mkdir -p $(DESTDIR)/usr/lib/python2.5/site-packages
	mkdir -p $(DESTDIR)/usr/bin $(DESTDIR)/usr/share/pyjaco
	rsync -vaP pyjaco $(DESTDIR)/usr/lib/python2.5/site-packages
	rsync -vaP pyjs.py $(DESTDIR)/usr/bin/pyjaco
	rsync -vaP py-builtins.js $(DESTDIR)/usr/share/pyjaco

clean-package: clean
	debian/rules clean
