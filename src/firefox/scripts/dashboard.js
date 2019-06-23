function hide_header() {
	document.querySelector("#dashboard_headerinfo").style.display = "none";
	document.querySelector("#page-header .card-block")
		.style.minHeight = "0px";

	var btn = document.getElementById("header_toggle_button");
	btn.innerText = '\uf103';
	btn.onclick = show_header;
}
function show_header() {
	document.querySelector("#dashboard_headerinfo").style.display = "";
	document.querySelector("#page-header .card-block")
		.style.minHeight = "";

	var btn = document.getElementById("header_toggle_button");
	btn.innerText = '\uf102';
	btn.onclick = hide_header;
}

browser.storage.sync.get([
	"hide_dashboard_header"
]).then((res) => {

	if(res.hide_dashboard_header) {
		// append button to navbar, if it doesn't already exist
		if(!document.getElementById("header_toggle_button")) {
			var show_header_btn = document.createElement("button");
			show_header_btn.classList.add("btn", "btn-secondary", "iconawe");
			//arrows: left: '\uf100', right: '\uf101', up: '\uf102', down: '\uf103';
			show_header_btn.innerText = '\uf103';
			show_header_btn.setAttribute("id", "header_toggle_button");

			var show_header_btn_div = document.createElement("div");
			show_header_btn_div.classList.add("breadcrumb-button", "pull-xs-right");

			show_header_btn_div.appendChild(show_header_btn);
			document.getElementById("page-navbar").appendChild(show_header_btn_div);

			hide_header();
		}
	}

});