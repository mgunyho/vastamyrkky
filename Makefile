
FIREFOX_PACKAGE=./vastamyrkky.zip

.PHONY: clean all

default:
	@echo "run 'make firefox' to package for Firefox"

firefox:
	cd src/firefox; zip -r -FS ../../$(FIREFOX_PACKAGE) . -x icons/*xcf

all: firefox

clean:
	rm -f $(FIREFOX_PACKAGE)
