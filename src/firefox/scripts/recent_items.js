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

	browser.storage.sync.get([
			"recent_items",
			"show_recent_items_in_sidebar_max"
	]).then((res) => {
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

			// remove old entries if there are too many of them
			var max_items = res.show_recent_items_in_sidebar_max || 5;
			courseItems = courseItems.sort((a, b) => a.timestamp < b.timestamp);
			courseItems.splice(max_items)

			// if the current entry exists in the history, remove it
			function strip(url) {
				return url.replace(/(\?|&)?forcedownload=\d/g, "");
			}
			courseItems = courseItems.filter(x => strip(x.URL) != strip(entry.URL));
			courseItems.push(entry);

			// join items back
			var newItems = notCourseItems;
			courseItems.forEach((x) => newItems.push(x));

			browser.storage.sync.set({recent_items: newItems});
		});
}

function addRecentItemsToSidebar(dashboard = false) {
	// if dashboard == true, assume we're on the dashboard and add course items from all courses

	var courseID = findCourseID();

	browser.storage.sync.get([
			"recent_items",
			"show_recent_items_in_sidebar_max"
	]).then((res) => {
			var courseItems;
			if(!dashboard) {
				courseItems = res.recent_items.filter(item =>
					item.courseID == courseID);
			} else {
				courseItems = res.recent_items;
			}


			//console.log("courseID", courseID, "courseItems", courseItems);
			var max_items = res.show_recent_items_in_sidebar_max || 5; // eh, hardcoded default...
			courseItems = courseItems.sort((a, b) => a.timestamp < b.timestamp);
			courseItems.splice(max_items)

			if(courseItems.length > 0) {
				//console.log("courseItems", courseItems);

				var nav = document.createElement("nav");

				var title = document.createElement("p");
				title.classList.add("list-group-item");
				title.innerText = "Recent items";

				nav.appendChild(title);
				nav.classList.add("list-group", "m-t-1");

				courseItems.forEach((item) => {
					var a = document.createElement("a");
					a.href = item.URL;
					a.classList.add("list-group-item");
					a.addEventListener("click", (e) => {
						var entry = Object.assign({}, item);
						entry.timestamp = (new Date()).getTime();
						addEntryToRecentItems(entry);
					}, false);
					a.dataset.vastamyrkkyId = generateShortUID(); // tag links created by us

					var linkText = item.resourceName;
					if(dashboard) {
						//TODO: good? okay to use split? add option for no prefix?
						linkText = item.courseTitle.split(" - ")[0] + " " + linkText;
					}

					a.innerHTML = `
					<div class="m-l-0">
					<div class="media">
					<span class="media-left">
					<img class="icon " alt="" aria-hidden="true" src="https://mycourses.aalto.fi/theme/image.php/aalto_mycourses/core/1561468713/i/section">
					</span>
					<span class="media-body ">${linkText}</span>
					</div>
					</div>
					`;

					nav.appendChild(a);
				});

				var sidebar_navs_parent = document.getElementById("nav-drawer");
				var sidebar_groups = sidebar_navs_parent.children;
				sidebar_navs_parent.insertBefore(nav, sidebar_groups[sidebar_groups.length - 1]);
			}

		});


} // addRecentItemsToSidebar

function hookCallback(links, callback) {
	/*
	 * Attach a callback to a list of link nodes.
	 */
	links.forEach((a) => {
		if(!a.dataset.vastamyrkkyId) { // avoid adding callback twice
			//a.href = "#";
			//console.log("adding event listener", a);
			a.addEventListener("click", callback, false);
		}
	});
}

function filterResourceLinks(links) {
	/*
	 * Given a list of links, figure out and return those that are "resources",
	 * i.e. PDFs.
	 */
	return Array.from(links).filter(a => {
		var ptns = [
			"https?://mycourses.aalto.fi/mod/resource",
			/https?:\/\/mycourses.aalto.fi\/pluginfile.php\/\d+\/mod_assign\/introattachment/,
			/https?:\/\/mycourses.aalto.fi\/pluginfile.php\/\d+\/mod_folder\/.*\.pdf/,
		];
		var ret = false;
		ptns.forEach(ptn => ret |= Boolean(a.href.match(ptn)));
		//if(ret) { console.log(a); }
		return ret;
	});
}

function addResourceCallbacks() {
	/*
	 * Attach a callback function to all "resource" links on the page, as well
	 * as to new resource links as they are dynamically added.
	 */

	var courseID = findCourseID();

	// the callback that will be added
	function addEntryCallback(e) {
		var link = e.target.closest("a");
		var span = link.querySelector("span");
		var resourceName;
		if(span) {
			if(span.classList.contains("fp-icon")) {
				// special case for mod_folder
				resourceName = span.parentElement.textContent.trim();
			} else {
				resourceName = span.firstChild.textContent.trim();
			}
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
		addEntryToRecentItems(entry);
	}

	// attach callback to all resource links on page
	hookCallback(filterResourceLinks(document.querySelectorAll("a")),
		         addEntryCallback);

	// also attach callbacks whenever new links are added using the MutationObserver API
	(new MutationObserver(function(mutationList, observer) {
		mutationList.forEach(mut => {
			if(mut.type === "childList") {
				//console.log("observed mutation:", mut);
				Array.from(mut.addedNodes).forEach(node => {
					//console.log("added node with links:", links);
					hookCallback(filterResourceLinks(node.querySelectorAll("a")),
						         addEntryCallback);
				});
			}
		});
	})).observe(document.querySelector("#page-wrapper"),
		        {subtree: true, childList: true});
} // addResourceCallbacks
