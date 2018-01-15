/**
 * Created by RiccardoCh on 29/01/16.
 */

// GET LANGUAGE
getLanguage = function () {
    var lang = window.navigator.languages ? window.navigator.languages[0] : null;
    lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if (lang.indexOf('-') !== -1)
        lang = lang.split('-')[0];
    if (lang.indexOf('_') !== -1)
        lang = lang.split('_')[0];
    if (lang == undefined || lang == null) {
        lang = "en";
    }
    return lang;
};

// CHECK IF URL EXISTS
UrlExists = function (url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
};



// GET PUBLIC IP
getPublicIP = function () {

    var url = "https://api.ipify.org/?format=json";
    var request = new XMLHttpRequest();

    request.addEventListener("readystatechange", processRequest, false);

    // TO DO BEFORE STARTING BACKGROUND ACTION
    var path = window.location.pathname;
    var page = path.split("/").pop();
    // EDIT BOARD PAGE
    if (page == "edit_board.html") {
        showAlertWithIP();
    }

    function processRequest(e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.body.className = 'ok';

                var info = JSON.parse(request.responseText)

                console.log("---------------> Public IP: " + info["ip"]);
                var publicIP = info["ip"];

                sessionStorage.setItem("publicIP", publicIP);

                // ACTION WHEN FINISHED
                var path = window.location.pathname;
                var page = path.split("/").pop();
                // BOARD DETAIL PAGE
                if (page == "board_detail.html") {
                    updatePublicIP();
                }
                // EDIT BOARD PAGE
                else if (page == "edit_board.html") {

                    var content = 'This is your public IP: <b>' + publicIP + '</b>';
                    publicIpAlert.setContent(content)
                }

            } else {
                error = 'Error! Status code ' + request.status;
                console.log(error);
            }
        }
    }

    request.open("GET", url, true);
    request.send(null);
};


// LOADER
loaderFunc = function (show, text) {
    if (show) {
        var textIsVisible = false;
        if (text != undefined) {
            textIsVisible = true
        }
        $.mobile.loading("show", {
            text: "Loading",
            textVisible: textIsVisible
        });
    }
    else {
        $.mobile.loading("hide", {});
    }
};


// GO TO PAGE
goToPage = function(href){
    window.location.href = href;
};

// GO BACK
goBack = function(){
    window.history.back();
};


