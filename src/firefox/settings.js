function saveOptions(e) {
	document.querySelector("#settings_saved_message").style.display = "none";
	browser.storage.sync.set({
		hide_dashboard_header: document.querySelector("#hide_dashboard_header").checked,
		sort_latest_grades: document.querySelector("#sort_latest_grades").checked,
		course_page_compact_header: document.querySelector("#course_page_compact_header").checked,
		course_page_title_link: document.querySelector("#course_page_title_link").checked,
		show_recent_items_in_sidebar: document.querySelector("#show_recent_items_in_sidebar").checked,
		show_recent_items_in_sidebar_max: document.querySelector("#show_recent_items_in_sidebar_max").valueAsNumber,
		//TODO: 'show recent items at the top of the sidebar'
		//TODO: 'no. of recent items to show on front page (checkbox for "same as sidebar")' (?)
		//TODO: add option to always force download?
		prevent_forcedownload: document.querySelector("#prevent_forcedownload").checked,
		activities_to_sidebar: document.querySelector("#activities_to_sidebar").checked,
		sidebar_animation_duration: document.querySelector("#sidebar_animation_duration").valueAsNumber,
		redirect_loginpage: document.querySelector("#redirect_loginpage").value,
		disable_login_dropshadow: document.querySelector("#disable_login_dropshadow").checked
	}).then((res) => {
		document.querySelector("#settings_saved_message").style.display = "";
	});
	e.preventDefault();
}

function checkDefault(x, default_value) {
	return typeof(x) === "undefined" ? default_value : x;
}
function restoreOptions() {
	browser.storage.sync.get([
		"hide_dashboard_header",
		"sort_latest_grades",
		"course_page_compact_header",
		"course_page_title_link",
		"show_recent_items_in_sidebar",
		"show_recent_items_in_sidebar_max",
		"prevent_forcedownload",
		"activities_to_sidebar",
		"sidebar_animation_duration",
		"redirect_loginpage",
		"disable_login_dropshadow"
	]).then((res) => {
		//console.log(res);
		document.querySelector("#hide_dashboard_header").checked = res.hide_dashboard_header;
		document.querySelector("#sort_latest_grades").checked = res.sort_latest_grades;
		document.querySelector("#course_page_compact_header").checked = res.course_page_compact_header;
		document.querySelector("#course_page_title_link").checked = res.course_page_title_link;

		var recent_items_checkbox = document.querySelector("#show_recent_items_in_sidebar");
		recent_items_checkbox.checked = res.show_recent_items_in_sidebar;
		recent_items_checkbox.dispatchEvent(new Event("input", {"bubbles": true, "cancelable": true}));

		document.querySelector("#show_recent_items_in_sidebar_max").valueAsNumber = checkDefault(res.show_recent_items_in_sidebar_max, 5);

		document.querySelector("#prevent_forcedownload").checked = res.prevent_forcedownload;
		document.querySelector("#activities_to_sidebar").checked = res.activities_to_sidebar;

		var sidebar_duration_slider = document.querySelector("#sidebar_animation_duration");
		sidebar_duration_slider.valueAsNumber = checkDefault(res.sidebar_animation_duration, 0.5);
		sidebar_duration_slider.dispatchEvent(new Event("input", {"bubbles": true, "cancelable": true})); // notify the slider of the value, to update the display

		document.querySelector("#redirect_loginpage").value = res.redirect_loginpage || "";
		document.querySelector("#disable_login_dropshadow").checked = res.disable_login_dropshadow;
	});
}

document.addEventListener("DOMContentLoaded", function() {
	// some initialization stuff
	document.querySelector("#show_recent_items_in_sidebar").addEventListener("input", (e) => {
		var b = e.srcElement.checked;
		var ids = [
			"#show_recent_items_in_sidebar_max",
			"#clear_recent_items",
		];
		ids.forEach(id => {
			var sel = document.querySelector(id);
			sel.disabled = !b;
			if(b) {
				sel.closest("label").classList.remove("disabled");
			} else {
				sel.closest("label").classList.add("disabled");
			}
		});
	});

	document.querySelector("#clear_recent_items").addEventListener("click", (e) => {
		document.querySelector("#recent_items_cleared_message").style.display = "none";
		browser.storage.sync.set({
			"recent_items": []
		}).then((res) => {
			document.querySelector("#recent_items_cleared_message").style.display = "inline";
		});
	});

	document.querySelector("#sidebar_animation_duration").addEventListener("input", (e) => {
		document.querySelector("#sidebar_duration_display").innerText = e.srcElement.valueAsNumber.toFixed(2);
	});
	document.querySelector("form").addEventListener("submit", saveOptions);
});
document.addEventListener("DOMContentLoaded", restoreOptions);
