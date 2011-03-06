
generate: gol.html triangulation.html ui.html

%.html: %.py
	@echo "Compiling [$<]"
	@PYTHONPATH=.. python $< > $@

clean:
	@rm -fv *.html *~
