browser.storage.sync.get([
	"course_page_compact_header",
	"show_recent_items_in_sidebar",
	"activities_to_sidebar",
	"sidebar_animation_duration" // TODO: move to 'common.js'
]).then((res) => {
	if(res.course_page_compact_header) {
		var css = "";
		css += "#page-header .page-header-headings { padding: 0.4rem 1.25rem; position: static;}";
		css += "#page-header .page-header-headings h1 { font-size: 1.75rem; padding: 0; margin: 0; }";
		css += "#page-header #courseactivitymenu { position: static; float: right; margin-top: 5px; margin-bottom: 5px; }";
		css += "#page-header .card-block { min-height: auto; margin-bottom: 0; }";
		css += "#page-header .card-block .context-header-settings-menu { margin: 0; }";
		css += ".page-context-header { overflow: visible; }"
		css += ".pull-xs-left { height: 100%; }"

		injectCSS(css);
	}

	if(res.show_recent_items_in_sidebar) {
		//TODO: implement this for front page sidebar also

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

		function addResourceCallbacks() {
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

		function addRecentItemsToSidebar()
		{

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

					console.log("courseID", courseID, "courseItems", courseItems);
					courseItems = courseItems.sort((a, b) => {return a.timestamp < b.timestamp; });
					courseItems.forEach((item) => {
						var a = document.createElement("a");
						a.href = item.URL;
						a.classList.add("list-group-item");
						a.addEventListener("click", (e) => {
							var entry = Object.assign({}, item);
							entry.timestamp = (new Date()).getTime();
							console.log(entry);
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

		var isModPage = window.location.pathname.match("/mod/assign/view.php");

		if(document.readyState !== 'loading') {
			addRecentItemsToSidebar();
			if(!isModPage) addResourceCallbacks();
		} else {
			document.addEventListener("DOMContentLoaded", function() {
				addRecentItemsToSidebar();
				if(!isModPage) addResourceCallbacks();
			});
		}

		if(isModPage) {
			// on 'mod' pages, attach callbacks when the page has been completely loaded
			window.addEventListener("load", function() {
				console.log("isModPage load");
				addResourceCallbacks();
			});
		}

	}

	if(res.activities_to_sidebar) {
		//TODO: DOMContentLoaded doesn't always fire, use init function (like above)
		document.addEventListener("DOMContentLoaded", function() {
			var menu = document.getElementById("courseactivitymenu");
			var links = Array.from(menu.children);
			var sidebar_navs_parent = document.getElementById("nav-drawer");
			var sidebar_groups = sidebar_navs_parent.children;

			var nav = document.createElement("nav");
			nav.classList.add("list-group", "m-t-1");
			links.forEach((link) => {
				var a = document.createElement("a");
				a.href = link.href;
				a.classList.add("list-group-item");

				a.innerHTML = `
				<div class="m-l-0">
                    <div class="media">
                        <span class="media-left">
                            <img class="icon " alt="" aria-hidden="true" src="https://mycourses.aalto.fi/theme/image.php/aalto_mycourses/core/1561468713/i/section">
                        </span>
                        <span class="media-body ">${link.textContent}</span>
                    </div>
                </div>
				`;

				nav.appendChild(a);
			});

			sidebar_navs_parent.insertBefore(nav, sidebar_groups[sidebar_groups.length - 1]);

		});

		injectCSS("#courseactivitymenu { display: none; }");
	}

	if(res.sidebar_animation_duration != undefined && res.sidebar_animation_duration < 0.5) {
		var len = res.sidebar_animation_duration;
		var transition = `margin-left ${len}s ease,margin-right ${len}s ease,left ${len}s ease,right ${len}s ease`;
		var all_transitions = `
				-webkit-transition: ${transition};
				-moz-transition: ${transition};
				-o-transition: ${transition};
				transition: ${transition};
			`;
		var css = "";
		css += `[data-region="drawer"] { ${all_transitions} }`;
		css += `body.drawer-ease { ${all_transitions} }`;
		//console.log(all_transitions);
		//console.log(css);
		injectCSS(css);
	}
});
