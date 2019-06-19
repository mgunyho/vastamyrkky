function saveOptions(e) {
	browser.storage.sync.set({
		disable_login_dropshadow: document.querySelector("#disable_login_dropshadow").checked
	});
	e.preventDefault();
}

function restoreOptions() {
	browser.storage.sync.get("disable_login_dropshadow").then((res) => {
		//console.log(res);
		document.querySelector("#disable_login_dropshadow").checked = res.disable_login_dropshadow;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
