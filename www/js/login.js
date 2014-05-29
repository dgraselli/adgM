

function checkPreAuth() {
   alert(window.localStorage["username"]);
   var form = $("#loginForm");
   if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {

    var form = $("#loginForm");    
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    if(u != '' && p!= '') {
        $.post(host+"/login", {username:u,password:p}, function(res) {
            if(res.success ) {
                //store
                window.localStorage["username"] = res.username;
                window.localStorage["remember_token"] = res.remember_token;             
                $.mobile.changePage("#page1",  { transition: "slide"} );

            } else {
            	alert(res.message);
                //navigator.notification.alert("Usuario no valido", function() {});
            }
         $("#submitButton").removeAttr("disabled");
        },"json");
    } else {
        alert(1);
        //navigator.notification.alert("You must enter a username and password", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function deviceReady() {

	$("#loginForm").on("submit",handleLogin);

	if(window.localStorage["remember_token"])
	{
		$.mobile.changePage("#page1");
	}


}