function injectCSS(css) {
	var style = document.createElement("style");
	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	document.getElementsByTagName('head')[0].appendChild(style);
}

function hookResourceLinks(callback) {
	// find all links on the page, and attach the function 'callback' to all
	// links that are 'resources', i.e. PDF files and such that should be added
	// to the recent items list. Actually adding them to the recent items
	// should be handled by 'callback'

	//TODO: doesn't work for 'pluginfile.php'

	var links = Array.from(document.querySelectorAll("a")).filter((a) => {
		return Boolean(a.href.match("https?://mycourses.aalto.fi/mod/resource"));
	});

	//console.log(links);

	links.forEach((a) => {
		//console.log(a);
		//console.log(a.href);
		//a.href = "#";
		a.addEventListener("click", callback, false);
	});
}
