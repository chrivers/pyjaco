
all:
	@cat library/*.js > py-builtins.js

clean:
	@rm -fv py-builtins.js library/*~