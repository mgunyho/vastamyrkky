# Vastamyrkky: Tweaks for MyCourses

Vastamyrkky is a browser extension that allows you to tweak the MyCourses
learning environment in use at Aalto University. Currently, it works for Firefox,
but it shouldn't be too difficult to port to Chrome.

## Hacking on Firefox

1. Clone or download the repo
1. Open Firefox, type `about:debugging` into the address bar
1. Click `This Firefox` and `Load Temporary Add-on...` and navigate to the `manifest.json` file in `vastamyrkky/src/firefox/`.
1. Change the extension settings by clicking on the extension icon in the toolbar or going to `about:addons`.

## Adding a new option

To add a new setting, follow these steps:

1. Add an input (checkbox, drop-down menu etc.) for your setting to the form in `settings.html`.
1. Add your setting and the corresponding query selector to the `browser.storage.sync.set` call in `settings.js`
1. Add your setting to the `browser.storage.sync.get` call and add a corresponding query selector to the `then` block in `settings.js`
1. Add your setting to the `browser.storage.sync.get` call in the script which you want it to be executed (e.g. `dashboard.js` or `coursepage.js`) and implement the logic

## Packaging

To package the extension for releasing for Firefox, run `make firefox` in the
root directory,
