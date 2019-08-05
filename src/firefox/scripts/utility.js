function injectCSS(css) {
	var style = document.createElement("style");
	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	document.getElementsByTagName('head')[0].appendChild(style);
}

function findCourseID() {
	/* Scrape the current page for the MyCourses course ID (i.e.
	 * mycourses.aalto.fi/course/view.php?id=XXXXX).
	 * The course ID might not be visible directly in the URL, but can be found
	 * e.g. in the navigation bar ("Dashboard / My own courses / ...).
	 */

	var url = window.location.toString();
	var courseID;
	if(url.match("https?://mycourses.aalto.fi/course/view.php")) {
		courseID = window.location.search.substr(1).split("&")
			.find((p) => p.startsWith("id")).split("=")[1];
	} else {
		// this is the link to the home page of the course
		var a = Array.from(document.querySelectorAll("a"))
			.find(a => a.dataset.key == "coursehome");

		courseID = a.href.match(/id=\d+/)[0].split("=")[1];
	}

	return courseID;
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
