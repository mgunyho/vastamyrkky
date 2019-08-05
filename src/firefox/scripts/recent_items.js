/*
 * This file contains function definitions relating to handling the list
 * of recently visited items.
 */


function addEntryToRecentItems(entry) {
	/* Add an entry object to the list of recently accessed items.
	 * `entry` should have the following attributes:
	 * `resourceName`: the name of the file etc. in question
	 * `courseTitle`: the title of the associated course
	 * `courseID`: the MyCourses ID of the course (i.e. mycourses.aalto.fi/course/view.php?id=XXXXX)
	 * `timestamp`: unix timestamp of when the entry was created
	 * `URL`: URL of the file the link is pointing to
	 */

	//console.log(entry);

	browser.storage.sync.get("recent_items")
		.then((res) => {
			var items = res.recent_items || [];

			// partition history into items that are for this course
			// and those that are not
			var courseItems = [];
			var notCourseItems = [];
			items.forEach((x) => {
				if(x.courseID == entry.courseID) {
					courseItems.push(x);
				} else {
					notCourseItems.push(x);
				}
			});
			//console.log("notCourseItems", notCourseItems);
			//console.log("courseItems before", courseItems);

			// remove old entries if there are too many of them
			//TODO: try sort by timestamp and splice instead of while?
			while(courseItems.length > 5) {
				var oldestItem = courseItems.reduce((res, cur) => {
					return res.timestamp < cur.timestamp ? res : cur;
				});
				//console.log("oldestItem", oldestItem.timestamp);
				courseItems = courseItems.filter(item =>
					item.timestamp != oldestItem.timestamp);
			}
			//console.log("courseItems after", courseItems);

			// if the current entry exists in the history, remove it
			courseItems = courseItems.filter(x => x.URL != entry.URL);

			courseItems.push(entry);
			//console.log("courseItems after 2", courseItems);

			// join items back
			var newItems = notCourseItems;
			courseItems.forEach((x) => newItems.push(x));

			//console.log("newItems", newItems);
			browser.storage.sync.set({recent_items: newItems});
		});
}

function addRecentItemsToSidebar() {

	var sidebar_navs_parent = document.getElementById("nav-drawer");
	var sidebar_groups = sidebar_navs_parent.children;

	var nav = document.createElement("nav");

	var title = document.createElement("p");
	title.classList.add("list-group-item");
	title.innerText = "Recent items";

	//TODO: don't append if no recent items
	nav.appendChild(title);

	var courseID = findCourseID();

	browser.storage.sync.get("recent_items")
		.then((res) => {
			var courseItems = res.recent_items.filter(item =>
				item.courseID == courseID);

			//console.log("courseID", courseID, "courseItems", courseItems);
			courseItems = courseItems.sort((a, b) => {return a.timestamp < b.timestamp; });
			courseItems.forEach((item) => {
				var a = document.createElement("a");
				a.href = item.URL;
				a.classList.add("list-group-item");
				a.addEventListener("click", (e) => {
					var entry = Object.assign({}, item);
					entry.timestamp = (new Date()).getTime();
					//console.log(entry);
					addEntryToRecentItems(entry);
				}, false);
				a.dataset.vastamyrkkyId = generateShortUID(); // tag links created by us

				a.innerHTML = `
					<div class="m-l-0">
					<div class="media">
					<span class="media-left">
					<img class="icon " alt="" aria-hidden="true" src="https://mycourses.aalto.fi/theme/image.php/aalto_mycourses/core/1561468713/i/section">
					</span>
					<span class="media-body ">${item.resourceName}</span>
					</div>
					</div>
					`;

				nav.appendChild(a);
			});

		});


	nav.classList.add("list-group", "m-t-1");
	sidebar_navs_parent.insertBefore(nav, sidebar_groups[sidebar_groups.length - 1]);
} // addRecentItemsToSidebar

function hookResourceLinks(callback) {
	// find all links on the page, and attach the function 'callback' to all
	// links that are 'resources', i.e. PDF files and such that should be added
	// to the recent items list. Actually adding them to the recent items
	// should be handled by 'callback'

	var links = Array.from(document.querySelectorAll("a")).filter((a) => {
		var ret = Boolean(a.href.match("https?://mycourses.aalto.fi/mod/resource"));
		ret |= Boolean(a.href.match(/https?:\/\/mycourses.aalto.fi\/pluginfile.php\/\d+\/mod_assign\/introattachment/));

		return ret;
	});

	//console.log(links);

	links.forEach((a) => {
		if(!a.dataset.vastamyrkkyId) { // avoid adding callback twice
			//console.log(a);
			//console.log(a.href);
			//a.href = "#";
			a.addEventListener("click", callback, false);
		}
	});
}

function addResourceCallbacks() {
	/*
	 * Attach a callback function using hookResourceLinks
	 */

	var courseID = findCourseID();
	hookResourceLinks((e) => {
		//console.log(e);
		var link = e.target.closest("a");
		var span = link.querySelector("span");
		var resourceName;
		if(span) {
			resourceName = span.firstChild.textContent.trim();
		} else {
			resourceName = link.textContent.trim();
		}

		var entry = {
			resourceName: resourceName,
			courseTitle: document.querySelector("#page-header")
			.querySelector("h1").textContent,
			courseID: courseID,
			timestamp: (new Date()).getTime(),
			URL: link.href,
		};
		//console.log(entry);
		addEntryToRecentItems(entry);
	});
}
