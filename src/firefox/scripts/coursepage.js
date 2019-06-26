browser.storage.sync.get([
	"course_page_compact_header"
]).then((res) => {
	if(res.course_page_compact_header) {
		var css = "";
		css += "#page-header .page-header-headings { padding: 0.4rem 1.25rem; position: static;}";
		css += "#page-header .page-header-headings h1 { font-size: 1.75rem; padding: 0; margin: 0; }";
		css += "#page-header #courseactivitymenu { position: static; float: right; margin-top: 5px; margin-bottom: 5px; }";
		css += "#page-header .card-block { min-height: auto; margin-bottom: 0; }";
		css += "#page-header .card-block .context-header-settings-menu { margin: 0; }";
		css += ".page-context-header { overflow: visible; }"
		css += ".pull-xs-left { height: 100%; }"

		injectCSS(css);
	}
	console.log(res);
});
