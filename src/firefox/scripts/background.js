// open settings page when user clicks on the toolbar icon
browser.browserAction.onClicked.addListener(function() {
	browser.runtime.openOptionsPage();
});
