function createCookie(name,value,days) {  
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		//var expires = "; expires="+date.toGMTString();
		var expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
	}
	else var expires = "";
    document.cookie = name+"="+value+expires+"; SameSite=Strict; path=/";    
}

function readCookie(name) {  
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}