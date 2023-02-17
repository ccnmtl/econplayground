APP=econplayground
JS_FILES=media/js/src

all: jenkins

include *.mk

js-build: $(JS_SENTINAL)
	rm -rf media/js/build/*
	npm run build
.PHONY: js-build
