browser.storage.sync.get([
	"course_page_compact_header"
]).then((res) => {
	if(res.course_page_compact_header) {
		// the default is 220px
		//TODO: make more compact
		document.querySelector("#page-header .card-block").style.minHeight = "130px";
	}
	console.log(res);
});
