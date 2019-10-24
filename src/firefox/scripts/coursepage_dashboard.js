/*
 * This script contains routines that are common to course pages and the
 * dashboard.
 */

browser.storage.sync.get([
	"prevent_forcedownload",
	"sidebar_animation_duration"
]).then((res) => {

	if(res.prevent_forcedownload) {

		function initPreventForceDownload() {
			//TODO: modify PDF mime type in request headers to really prevent forcedownload?
			//see e.g. addListener() in https://github.com/didierfred/SimpleModifyHeaders/blob/master/background.js
			//also see https://stackoverflow.com/questions/6293893/how-do-i-force-files-to-open-in-the-browser-instead-of-downloading-pdf
			function clearForceDownload(a) {
				if(a.href.match("forcedownload")) {
					a.href = a.href.replace(/(\?|&)?forcedownload=1/g, "");
				}
			}
			document.querySelectorAll("a").forEach(a => clearForceDownload(a));

			// listener for new <a> nodes added to the DOM tree, clear those of forcedownload as well
			(new MutationObserver(function(mutations, observer) {
				mutations.forEach(mut => {
					mut.addedNodes.forEach(node => {
						if(node.tagName === "A") {
							clearForceDownload(node);
						}
					});
				});
			})).observe(document.body, {
				childList: true,
				subtree: true
			});
		}

		onLoadInit(initPreventForceDownload);
	}


	if(res.sidebar_animation_duration != undefined 
		&& res.sidebar_animation_duration < 0.5) {
		setSidebarAnimationDuration(res.sidebar_animation_duration);
	}
});
