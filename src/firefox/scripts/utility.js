function injectCSS(css) {
	var style = document.createElement("style");
	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	document.getElementsByTagName('head')[0].appendChild(style);
}

function generateShortUID() {
	// collisions should be rare for < 1000 UIDs
	// from https://stackoverflow.com/a/6248722
	var a = (Math.random() * 46656) | 0;
	var b = (Math.random() * 46656) | 0;
	return ("000" + a.toString(36)).slice(-3) + ("000" + b.toString(36)).slice(-3);
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

		// a is undefined for (at least) the front page
		if(a) {
			courseID = a.href.match(/id=\d+/)[0].split("=")[1];
		}
	}

	return courseID;
}
