/**
 * Created by RiccardoCh on 21/12/15.
 */

<!-- JAVASCRIPT -->


// LOCALIZATION
var lang = getLanguage();
var localization = JSON.parse('{}');

// LOCALIZATION
var localizeStrings = function() {

    $.getJSON('../localization/strings.json', function (json) {
        localization = json;

        $('#header-title').html(localization[lang]['app']['name']);

        $('#login_btn1').val(localization[lang]['log-in']['button-title']);
        $('#login_btn1').button('refresh');
        $('#login_btn').html(localization[lang]['log-in']['button-title']);
        $('#login_title').html(localization[lang]['log-in']['info-title']);
        $('#login_desc').html(localization[lang]['log-in']['info-desc']);
        $('#login-popup-title').html(localization[lang]['log-in']['popup-title']);

        $('#signup_btn1').val(localization[lang]['sign-up']['button-title']);
        $('#signup_btn1').button('refresh');
        $('#signup_btn').html(localization[lang]['sign-up']['button-title']);
        $('#signup-popup-title').html(localization[lang]['sign-up']['popup-title']);

        $('#ip_label').html(localization[lang]['ip-conn']['info-title']);
        $('#ip_label_desc').html(localization[lang]['ip-conn']['info-desc']);
        $('#ip_address').attr('placeholder', localization[lang]['ip-conn']['ip-address']);
        $('#connect_btn').val(localization[lang]['ip-conn']['button-title']);
        $('#connect_btn').button('refresh');
    });

};

// BOARD
var board_ipaddress = location.host;

// PARSE
Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);

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

var username = "";
var password = "";
var email = "";
var user_objId = "";
var boardsList = [];


// Current user
var currentUser = Parse.User.current();
onLoad = function () {

    if (currentUser != null) {
        console.log(currentUser);
        getUserData();
    }

    localizeStrings();
};



logIn = function () {

    loaderFunc(true, "Loading");
    $('#popUpLogin').popup('close');

    username = $("#username").val();
    password = $("#password").val();

    if (currentUser == null) {
        Parse.User.logIn(username, password, {

            success: function (user) {

                currentUser = Parse.User.current();

                loaderFunc(false, undefined);
                user_objId = user.id;

                // Notice
                var options = {
                    content: "Great, " + username + "! You are logged in!",
                    color: 'green',
                    audio: '../JBox/audio/bling1',
                    volume: 100,
                    attributes: {y: 'bottom'}
                };
                new jBox('Notice', options);

                getUserData();
            },
            error: function (user, error) {
                loaderFunc(false, undefined);

                // Notice
                var options = {
                    content: "Sorry, " + username + "! You're unable to log in!" + "</br>" + "Error: " + error.message,
                    color: 'red',
                    audio: '../JBox/audio/beep2',
                    volume: 100,
                    attributes: {y: 'bottom'}
                };
                new jBox('Notice', options);
            }
        })
    }

};

// SIGN UP
signUp = function () {

    loaderFunc(true, "Loading");
    $('#popUpSignUp').popup('close');

    username = $("#username_signup").val();
    password = $("#password_signup").val();
    email = $("#email_signup").val();


    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    user.signUp(null, {
        success: function (user) {
            currentUser = Parse.User.current();
            loaderFunc(false, undefined);
            user_objId = user.id;

            var options = {
                content: "Great, " + username + "! You are signed up!",
                color: 'green',
                audio: '../JBox/audio/bling1',
                volume: 100,
                attributes: {y: 'bottom'}
            };
            new jBox('Notice', options);

            getUserData();
        },
        error: function (user, error) {
            loaderFunc(false, undefined);
            new jBox('Notice', {
                content: "Sorry! You're unable to sign up" + "</br>" + "Error: " + error.message,
                color: 'red',
                audio: '../JBox/audio/beep2',
                volume: 100,
                attributes: {y: 'bottom'}
            });
        }
    });
};

// CONNECT TO BOARD WITHOUT REGISTERING
connectToBoard = function () {
    ip_address = $("#ip_address").val();

    if (ip_address.length > 0) {
        sessionStorage.setItem("ip_address", ip_address);

        href = "board_detail.html";
        window.location.href = href;
    }
    else {
        // Notice
        var options = {
            content: "You have to insert a correct ip address",
            color: 'red',
            audio: '../JBox/audio/beep2',
            volume: 100,
            attributes: {y: 'bottom'}
        };
        new jBox('Notice', options);
    }
};


httpRequest = function (theUrl) {


    var request = new XMLHttpRequest();

    request.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        loaderFunc(false, undefined);
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.body.className = 'ok';
                console.log(request.responseText);
            } else {
                document.body.className = 'error';
                error = "Error! Status code " + request.status;
                console.log(error);
                // Notice
                var options = {
                    content: error,
                    color: 'red',
                    attributes: {y: 'bottom'},
                    audio: '../JBox/audio/beep2',
                    volume: 100,
                };
                new jBox('Notice', options);
            }
        }
    }

    request.open("GET", theUrl, true);
    request.send(null);
    loaderFunc(true, "Loading");
};
