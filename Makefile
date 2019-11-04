
FIREFOX_PACKAGE=./vastamyrkky.zip

.PHONY: clean all

default:
	@echo "run 'make firefox' to package for Firefox"

firefox:
	zip -r -FS $(FIREFOX_PACKAGE) src/firefox/* -x src/firefox/icons/*xcf

all: firefox

clean:
	rm -f $(FIREFOX_PACKAGE)
