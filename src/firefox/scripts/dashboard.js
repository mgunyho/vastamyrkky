function hide_header() {
	document.querySelector("#dashboard_headerinfo").style.display = "none";
	document.querySelector("#page-header .card-block")
		.style.minHeight = "0px";

	var btn = document.getElementById("header_toggle_button");
	btn.innerText = '\uf103';
	btn.onclick = show_header;
}
function show_header() {
	document.querySelector("#dashboard_headerinfo").style.display = "block";
	document.querySelector("#page-header .card-block")
		.style.minHeight = "";

	var btn = document.getElementById("header_toggle_button");
	btn.innerText = '\uf102';
	btn.onclick = hide_header;
}

browser.storage.sync.get([
	"hide_dashboard_header",
	"show_recent_items_in_sidebar",
]).then((res) => {

	if(res.hide_dashboard_header) {
		var css = "#dashboard_headerinfo { display: none; } #page-header .card-block { min-height: 0px; }";
		injectCSS(css);

		function initHideDashboardHeader() {
			// append 'show header' button to navbar
			var show_header_btn = document.createElement("button");
			show_header_btn.classList.add("btn", "btn-secondary", "iconawe");
			//arrows: left: '\uf100', right: '\uf101', up: '\uf102', down: '\uf103';
			show_header_btn.innerText = '\uf103';
			show_header_btn.setAttribute("id", "header_toggle_button");
			show_header_btn.onclick = show_header;

			var show_header_btn_div = document.createElement("div");
			show_header_btn_div.classList.add("breadcrumb-button", "pull-xs-right");

			show_header_btn_div.appendChild(show_header_btn);
			document.getElementById("page-navbar").appendChild(show_header_btn_div);
		}

		onLoadInit(initHideDashboardHeader);
	}

	if(res.show_recent_items_in_sidebar) {
		onLoadInit(function() {
			addRecentItemsToSidebar(dashboard = true);
		});
	}

});
