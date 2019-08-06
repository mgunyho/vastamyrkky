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
	"sort_latest_grades",
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

	if(res.sort_latest_grades) {
		onLoadInit(function() {
			var grades = document.querySelector("#grades");
			var tbody = grades.getElementsByTagName("tbody")[0];
			console.log(tbody);
			var rows = Array.from(tbody.getElementsByTagName("tr"));
			function parseDate(row) {
				console.log(row.children);
				var td = row.children[1];
				if(!td) return undefined; // eh
				var dateString = td.children[0].innerHTML.split("<br>")[1];
				dateString = dateString.replace(/\(|\)/g, "").trim();
				dateString = dateString.split(".").reverse().join("-");
				return dateString;
			}
			rows.map(row => tbody.removeChild(row))
				.sort((a, b) => parseDate(a) < parseDate(b))
				.forEach(row => tbody.appendChild(row));
		});
	}

	if(res.show_recent_items_in_sidebar) {
		onLoadInit(function() {
			addRecentItemsToSidebar(dashboard = true);
		});
	}

});
