// open settings page when user clicks on the toolbar icon
browser.browserAction.onClicked.addListener(function() {
	browser.runtime.openOptionsPage();
});

//TODO: only do this if prevent force dl is enabled in settings
browser.webRequest.onHeadersReceived.addListener(function(e) {
	for(var header of e.responseHeaders) {
		//console.log(header);
		if(header.name.toLowerCase() === "content-disposition") {
			var s = header.value.split(" ");
			if(s[0] === "attachment;") {
				header.value = "inline; " + s[1];
				console.log(header);
			}
		}
	}

	return { responseHeaders: e.responseHeaders };

}, {"urls": ["*://mycourses.aalto.fi/*"]}, ["blocking", "responseHeaders"]);
