browser.storage.sync.get([
	"course_page_compact_header",
	"show_recent_items_in_sidebar",
	"activities_to_sidebar",
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

		var isModPage = window.location.pathname.match("/mod/assign/view.php");

		onLoadInit(function() {
			addRecentItemsToSidebar();
			if(!isModPage) addResourceCallbacks();
		});

		if(isModPage) {
			// on 'mod' pages, attach callbacks when the page has been completely loaded
			window.addEventListener("load", function() {
				//console.log("isModPage load");
				addResourceCallbacks();
			});
		}

	}

	if(res.activities_to_sidebar) {
		function initSidebarActivities() {
			var menu = document.getElementById("courseactivitymenu");
			var links = Array.from(menu.children);
			var sidebar_navs_parent = document.getElementById("nav-drawer");
			var sidebar_groups = sidebar_navs_parent.children;

			var nav = document.createElement("nav");
			nav.classList.add("list-group", "m-t-1");

			var title = document.createElement("p");
			title.classList.add("list-group-item");
			title.innerText = "Activities";
			nav.appendChild(title);

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

		}

		onLoadInit(initSidebarActivities);

		injectCSS("#courseactivitymenu { display: none; }");
	}

});
