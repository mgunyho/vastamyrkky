browser.storage.sync.get([
	"redirect_loginpage",
	"disable_login_dropshadow"
]).then((res) => {
	//console.log(res);

	if(res.redirect_loginpage == "aaltologin") {
		// https://stackoverflow.com/a/506004
		// simulates HTTP redirect, no history entry
		window.location.replace("https://mycourses.aalto.fi/auth/shibboleth/index.php");
		// simulates clicking a link
		//window.location.href = "https://mycourses.aalto.fi/auth/shibboleth/index.php"
	} else if(res.redirect_loginpage == "hakalogin") {
		window.location.replace("https://mycourses.aalto.fi/Shibboleth.sso/HAKALogin?target=https://mycourses.aalto.fi/auth/shibboleth/index.php");
	}

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
