function saveOptions(e) {
	browser.storage.sync.set({
		hide_dashboard_header: document.querySelector("#hide_dashboard_header").checked,
		disable_login_dropshadow: document.querySelector("#disable_login_dropshadow").checked
	});
	e.preventDefault();
}

function restoreOptions() {
	browser.storage.sync.get([
		"hide_dashboard_header",
		"disable_login_dropshadow"
	]).then((res) => {
		//console.log(res);
		document.querySelector("#hide_dashboard_header").checked = res.hide_dashboard_header;
		document.querySelector("#disable_login_dropshadow").checked = res.disable_login_dropshadow;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
