// open settings page when user clicks on the toolbar icon
browser.browserAction.onClicked.addListener(function() {
	browser.runtime.openOptionsPage();
});


// Some files get force-downloaded even with forcedownload=0, this is due to
// the Content-Disposition HTTP header being "attachment". This is a callback
// function that replaces "attachment" with "inline" in the headers, which
// should open PDF files in a new tab instead of downloading.
function convertAttachmentToInline(e) {
	for(var header of e.responseHeaders) {
		if(header.name.toLowerCase() === "content-disposition") {
			var s = header.value.split(" ");
			if(s[0] === "attachment;") {
				header.value = "inline; " + s[1];
				//console.log(header);
			}
		}
	}

	return { responseHeaders: e.responseHeaders };

}

function addConvertListenerToHeadersReceived() {
	browser.webRequest.onHeadersReceived.addListener(
		convertAttachmentToInline,
		{"urls": ["*://mycourses.aalto.fi/*"]},
		["blocking", "responseHeaders"]
	);
}

// add listener on startup
browser.storage.sync.get([
	"prevent_forcedownload",
]).then(res => {
	if(res.prevent_forcedownload) {
		addConvertListenerToHeadersReceived();
	}
});

// add/remove listener when user changes settings
browser.storage.onChanged.addListener((changes, area) => {
	if(area === "sync") {
		//console.log(changes);
		if(changes.prevent_forcedownload.newValue === true) {
			addConvertListenerToHeadersReceived();
		} else {
			browser.webRequest.onHeadersReceived.removeListener(convertAttachmentToInline);
		}
	}
});
