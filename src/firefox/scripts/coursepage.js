browser.storage.sync.get([
	"course_page_compact_header",
	"activities_to_sidebar",
	"disable_sidebar_animation" // TODO: move to 'common.js'
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

	if(res.activities_to_sidebar) {
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

	if(res.disable_sidebar_animation) {
		//TODO: adjustable duration, this doesn't work
		//var len = 0.1;
		//var all_transitions = `
		//		-webkit-transition-duration: ${len};
		//		-moz-transition-duration: ${len};
		//		-o-transition-duration: ${len};
		//		transition-duration: ${len};
		//	`;
		var all_transitions = `
				-webkit-transition: none;
				-moz-transition: none;
				-o-transition: none;
				transition: none;
			`;
		var css = "";
		//css += "#nav-drawer: { transition: none; }";
		css += `[data-region="drawer"] { ${all_transitions} }`;
		css += `body.drawer-ease { ${all_transitions} }`;
		//console.log(all_transitions);
		//console.log(css);
		injectCSS(css);
	}
});
