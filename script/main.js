/**
 * Created by RiccardoCh on 21/12/15.
 */

<!-- JAVASCRIPT -->


// BOARD
var board_ipaddress = location.host;

// PARSE
Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);

$(document).ready(function () {
    // CONFIG CHANGED?
    if (sessionStorage.getItem("configurationChanged") == "true") {
        sessionStorage.setItem("configurationChanged", "false");
        retrieveBoardsList("main.html");
    }
});


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
var user_objId = "";
var boardsList = [];


// LOGOUT UI
logOutUI = function () {
    $("#logout_btn").text("Log out ● " + username);
};



// SHOW BOARD PAGE
showBoard = function (selected_board) {

    var href = "board_detail.html";
    sessionStorage.setItem("selected_board", selected_board);
    window.location.href = href;

};

// EDIT BOARD
editBoard = function (selected_board) {
    sessionStorage.setItem("newBoard", false);
    sessionStorage.setItem("boardToEdit", selected_board);

    href = "edit_board.html";
    window.location.href = href
};

// LIST OF BOARDS
setListOfBoardsUI = function () {

    $('#boards_list').empty();

    for (var i = 0; i < boardsList.length; i++) {

        var name = boardsList[i].name;
        var imageUrl = boardsList[i].image;
        var subtitle = boardsList[i].description;

        if (subtitle.length == 0) {
            subtitle = boardsList[i].localip;
        }

        var gearIcon = ""
        if (editMode) {
            gearIcon = '<a onclick=editBoard(' + i + ') data-position-to="window" data-transition="pop">'
        }

        $('<li>').append('<a id=' + i + ' onclick=showBoard(id)>' +
            '<img height="100" width="100" src=' + imageUrl + '><h2>' + name + '</h2>' +
            '<p>' + subtitle + '</p></a>' + gearIcon).appendTo('#boards_list');

    }

    $('#boards_list').listview().listview('refresh');
    $("#boards_list").trigger('create');
};

// Current user
var currentUser = Parse.User.current();
onLoad = function () {

    // GET PUBLIC IP
    getPublicIP();

    if (currentUser == null) {
        href = "index.html";
        window.location.href = href;
    }
    else {

        user_objId = currentUser.id;
        username = currentUser.getUsername();

        logOutUI();

        // GET BOARDS FROM LAST SESSION
        boardsList = JSON.parse(localStorage.boardsList);
        console.log(boardsList);

        setListOfBoardsUI();

        if (boardsList.length == 0) {
            retrieveBoardsList("main.html");
        }
        else{
            getLastConfigUpdate();
        }

    }
};


// EDIT BOARD
var editMode = false;
toggleEditMode = function () {
    editMode = !editMode;

    if (editMode) {
        document.getElementById("main_page_title").innerHTML = "Edit Mode";
        setListOfBoardsUI();
    }
    else {
        document.getElementById("main_page_title").innerHTML = "iFeel Smart";
        setListOfBoardsUI();
    }
};

// ADD BOARD
addBoard = function () {

    sessionStorage.setItem("newBoard", true);
    sessionStorage.setItem("boardToEdit", -1);

    href = "edit_board.html";
    window.location.href = href
};




logOut = function () {

    loaderFunc(true, "Loading");

    Parse.User.logOut();

    currentUser = Parse.User.current();

    loaderFunc(false, undefined);

    href = "index.html";
    window.location.href = href;
};


// HTTP REQUEST
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
                alertify.alert(error)
            }
        }
    }

    request.open("GET", theUrl, true);
    request.send(null);
    loaderFunc(true, "Loading");
};


// Get when it was the last config upate
getLastConfigUpdate = function () {

    var parseUserClass = Parse.Object.extend("User");
    var query = new Parse.Query(parseUserClass);
    query.get(Parse.User.current().id, {

        success: function (object) {

            if (object != null) {
                getUserData();
            }

        },
        error: function (object, error) {

        }
    });

};
