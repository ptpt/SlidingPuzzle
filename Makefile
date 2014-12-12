test:
	mocha js/tests.js

compile:
	coffee -o js src/*.coffee

watch:
	coffee -o js -w src/*.coffee

.PHONY: test compile watch
