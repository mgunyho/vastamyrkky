browser.storage.sync.get("disable_login_dropshadow").then((res) => {
	if(res.disable_login_dropshadow) {
		var css = ".greenloginbtn:hover { -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; }";
		var style = document.createElement("style");
		if(style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		document.getElementsByTagName('head')[0].appendChild(style);
	}
});
