# Vastamyrkky: Tweaks for MyCourses

Vastamyrkky is a browser extension that allows you to tweak the MyCourses
learning environment used in Aalto University. Currently, it works for Firefox,
but it shouldn't be too difficult to port to Chrome.

## Hacking on Firefox

1. Clone or download the repo
1. Open Firefox, type `about:debugging` into the address bar
1. Click `This Firefox` and `Load Temporary Add-on...` and navigate to the `manifest.json` file in `vastamyrkky/src/firefox/`.
1. Change the extension settings by clicking on the extension icon in the toolbar or going to `about:addons`.

## Packaging

To package the extension for releasing for Firefox, run `make firefox` in the
root directory,
