function saveOptions(e) {
	browser.storage.sync.set({
		hide_dashboard_header: document.querySelector("#hide_dashboard_header").checked,
		course_page_compact_header: document.querySelector("#course_page_compact_header").checked,
		activities_to_sidebar: document.querySelector("#activities_to_sidebar").checked,
		redirect_loginpage: document.querySelector("#redirect_loginpage").value,
		disable_login_dropshadow: document.querySelector("#disable_login_dropshadow").checked
	});
	e.preventDefault();
}

function restoreOptions() {
	browser.storage.sync.get([
		"hide_dashboard_header",
		"course_page_compact_header",
		"activities_to_sidebar",
		"redirect_loginpage",
		"disable_login_dropshadow"
	]).then((res) => {
		//console.log(res);
		document.querySelector("#hide_dashboard_header").checked = res.hide_dashboard_header;
		document.querySelector("#course_page_compact_header").checked = res.course_page_compact_header;
		document.querySelector("#activities_to_sidebar").checked = res.activities_to_sidebar;
		document.querySelector("#redirect_loginpage").value = res.redirect_loginpage || "";
		document.querySelector("#disable_login_dropshadow").checked = res.disable_login_dropshadow;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
