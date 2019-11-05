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

            // match only PDF files
            var ptn = /.*\.pdf(\?|$)/;

            function clearForceDownload(a) {
                if(a.href.match("forcedownload")) {
                    a.href = a.href.replace(/(\?|&)?forcedownload=1/g, "");
                }
            }
            document.querySelectorAll("a").forEach(a => {
                if(a.href.match(ptn)) {
                    clearForceDownload(a);
                }
            });

            // listener for new <a> nodes added to the DOM tree, clear those of forcedownload as well
            (new MutationObserver(function(mutations, observer) {
                mutations.forEach(mut => {
                    mut.addedNodes.forEach(node => {

                        if(node.tagName === "A" && node.href.match(ptn)) {
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
