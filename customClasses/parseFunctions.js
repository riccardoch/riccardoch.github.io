/**
 * Created by RiccardoCh on 27/01/16.
 */

Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);

// BOARD CONFIG
setBoardConfig = function (board, configString) {
    try {
        board.outputs = [];
        board.inputs = [];
        board.sensors = [];
        board.virtualInputs = [];

        /*configString = configString.replace(/u'/g, "\"");
         configString = configString.replace(/':/g, "\":");
         configString = configString.replace(/',/g, "\",");
         configString = configString.replace(/False/g, "false");
         configString = configString.replace(/True/g, "true");*/

        var config = JSON.parse(configString);
        for (var k = 0; k < config.length; k++) {
            var itemConfig = config[k];

            var category = itemConfig["category"];

            switch (category) {
                case "output":
                    var number = itemConfig["number"];
                    var type = itemConfig["type"];
                    var id = itemConfig["id"];
                    var name = itemConfig["name"];

                    var _output = new output(name, type);
                    _output.id = id;


                    // Notification
                    _output.pushActivated = itemConfig["pushActivated"];
                    _output.statusForSendingPush = itemConfig["statusForSendingPush"];
                    _output.pushMessage = itemConfig["pushMessage"];
                    _output.delayBeforeSendingPush = itemConfig["delayBeforeSendingPush"];
                    board.outputs.push(_output);
                    break;
                case "input":
                    var number = itemConfig["number"];
                    var type = itemConfig["type"];
                    var id = itemConfig["id"];
                    var name = itemConfig["name"];

                    var _input = new input(name, type);
                    _input.id = id;

                    // Notification
                    _input.pushActivated = itemConfig["pushActivated"];
                    _input.statusForSendingPush = itemConfig["statusForSendingPush"];
                    _input.pushMessage = itemConfig["pushMessage"];
                    _input.delayBeforeSendingPush = itemConfig["delayBeforeSendingPush"];

                    _input.outputToActivate = [];
                    for (var x = 0; x < itemConfig["outputToActivate"].length; x++) {
                        var item = itemConfig["outputToActivate"];
                        _input.outputToActivate.push(item)
                    }
                    board.inputs.push(_input);
                    break;
                case "sensor":
                    var number = itemConfig["number"];
                    var type = itemConfig["type"];
                    var id = itemConfig["id"];
                    var name = itemConfig["name"];

                    var _sensor = new sensor(name, type);
                    _sensor.id = id;

                    // Notification
                    _sensor.pushActivated = itemConfig["pushActivated"];
                    _sensor.statusForSendingPush = itemConfig["statusForSendingPush"];
                    _sensor.pushMessage = itemConfig["pushMessage"];
                    _sensor.delayBeforeSendingPush = itemConfig["delayBeforeSendingPush"];
                    _sensor.pushSensorValue = itemConfig["pushSensorValue"];

                    _sensor.out1 = itemConfig["out1"];
                    _sensor.out2 = itemConfig["out2"];

                    _sensor.database = itemConfig["database"];

                    board.sensors.push(_sensor);
                    break;
                case "virtualInput":
                    var id = itemConfig["id"];
                    var name = itemConfig["name"];
                    var desc = itemConfig[""];

                    var _virtualInput = new virtualInput(name, type);
                    _virtualInput.id = id;
                    _virtualInput.desc = desc;

                    board.virtualInputs.push(_virtualInput);
                    break;
            }
        }
    }
    catch (err) {
    }

    return board;
};

// ITEMS VALUE
setBoardItemsValue = function (board, itemsValueString) {
    try {
        var itemsValue = JSON.parse(itemsValueString);
        for (var k = 0; k < itemsValue.length; k++) {
            var item = itemsValue[k];
            var id = item["id"];

            for (var x = 0; x < board.outputs.length; x++) {
                if (board.outputs[x].id == id) {
                    board.outputs[x].value = item["value"];
                    break;
                }
            }

            for (var x = 0; x < board.inputs.length; x++) {
                if (board.inputs[x].id == id) {
                    board.inputs[x].value = item["value"];
                    break;
                }
            }

            for (var x = 0; x < board.sensors.length; x++) {
                if (board.sensors[x].id == id) {
                    board.sensors[x].value = item["value"];
                    break;
                }
            }

            for (var x = 0; x < board.virtualInputs.length; x++) {
                if (board.virtualInputs[x].id == id) {
                    board.virtualInputs[x].value = item["value"];
                    break;
                }
            }
        }
    }
    catch (err) {
    }
    return board;
};

// THRESHOLDS CONFIG
setBoardThresholdConfig = function (board, thresholdsSettingsString) {
    try {
        var thresholdsSettings = JSON.parse(thresholdsSettingsString);
        if (thresholdsSettings.length == board.sensors.length) {
            for (var k = 0; k < thresholdsSettings.length; k++) {
                var thresholdState = thresholdsSettings[k]["thresholdState"];
                var setValue = thresholdsSettings[k]["setValue"];
                board.sensors[k].thresholdState = thresholdState;
                board.sensors[k].setValue = setValue;
            }
        }
    }
    catch (err) {
    }
    return board;
};

// ALARM INFO
setBoardAlarmInfo = function (board, alarmInfoString) {
    try {
        var alarmInfo = JSON.parse(alarmInfoString);
        board.alarmState = alarmInfo["state"];
    }
    catch (err) {
    }
    return board;
};


// Retrieve boards from Parse
retrieveBoardsList = function (page) {

    loaderFunc(true, undefined);

    var ParseBoardClass = Parse.Object.extend("Boards");
    var query = new Parse.Query(ParseBoardClass);
    query.find({
            success: function (results) {

                loaderFunc(false, undefined);

                boardsList = [];

                for (var i = 0; i < results.length; i++) {

                    try {

                        var object = results[i];
                        console.log(object.get("name") + ": " + object.get("localip"));

                        var name = object.get("name");
                        var ip = object.get("localip");
                        var model = object.get("model");

                        var imageFile = object.get("image");
                        var imageUrl = "";

                        if (imageFile != undefined) {
                            imageUrl = imageFile.url();
                            imageUrl = imageUrl.replace('http://localhost:1337/parse/files/', PARSE_SERVER_URI + 'files/');
                            imageUrl = imageUrl.replace('http://' + PARSE_SERVER_DOMAIN_NAME + '/parse/files/', PARSE_SERVER_URI + 'files/');
                        }
                        else {
                            console.log(model);
                            switch (model) {
                                case 0:
                                    imageUrl = "../img/yun.jpg";
                                    break;
                                case 1:
                                    imageUrl = "../img/raspberry.jpg";
                                    break;
                                case 2:
                                    imageUrl = "../img/onion.jpg";
                                    break;
                                case 3:
                                    imageUrl = "../img/chiariniautomazioni.jpg";
                                    break;
                                default:
                                    imageUrl = "../img/chiariniautomazioni.jpg";
                                    break;
                            }
                        }

                        var desc = object.get("desc");
                        var subtitle = desc;
                        if (desc == "") {
                            subtitle = ip;
                        }

                        var board = new Board(name, ip);
                        board.id = object.id;
                        board.description = desc;
                        board.email = object.get("email");
                        board.sender_email = object.get("sender_email");
                        board.sender_password = object.get("sender_password");
                        board.image = imageUrl;
                        board.language = object.get("language");
                        board.locationName = object.get("locationName");
                        board.location = object.get("location");
                        board.model = model;
                        board.reference = object.get("reference");
                        board.remoteip = object.get("remoteip");
                        board.lastSync = object.get("lastItemsValueSync");

                        // GET CONFIG
                        var configString = object.get("config");
                        board = setBoardConfig(board, configString);

                        // SET ITEMS VALUES
                        var itemsValueString = object.get("itemsValue");
                        board = setBoardItemsValue(board, itemsValueString);

                        // SET THRESHOLDS STATE/VALUE
                        var thresholdsSettingsString = object.get("thresholdsSettings");
                        board = setBoardThresholdConfig(board, thresholdsSettingsString);

                        // ALARM
                        var alarmInfoString = object.get("alarmInfo");
                        board = setBoardAlarmInfo(board, alarmInfoString);

                        boardsList.push(board);

                    }
                    catch
                        (err) {
                        console.error(err);
                    }

                }

                //boardsList = results;
                console.log(boardsList);
                localStorage.boardsList = JSON.stringify(boardsList);

                // ACTION WHEN FINISHED
                //var path = window.location.pathname;
                //var page = path.split("/").pop();
                console.log("-------------> " + page);
                // INDEX PAGE
                if (page == "index.html") {
                    href = "board_detail.html";
                    window.location.href = href;
                }
                // MAIN
                else if (page == "main.html") {
                    setListOfBoardsUI();
                    setListOfItemsUI();
                }
            },
            error: function (error) {

                loaderFunc(false, undefined);

                alertify.alert("Error: " + error.code + "<\br>" + error.message);
            }
        }
    )
    ;
};

// Get User Data
getUserData = function () {

    var parseUserClass = Parse.Object.extend("User");
    var query = new Parse.Query(parseUserClass);
    query.get(Parse.User.current().id, {

        success: function (user) {

            var webInterface = user.get("webInterface");
            var webInterfaceScript = user.get("webInterfaceScript");
            var saveData = {
                webInterfaceScript: webInterfaceScript,
                webInterface: webInterface,
                username: user.getUsername()
            };
            localStorage.saveData = JSON.stringify(saveData);
            var href = "custom_layout.html";
            window.location.href = href;

        },
        error: function (object, error) {

        }
    });

};

// LOG OUT
logOut = function () {

    loaderFunc(true, "Loading");

    Parse.User.logOut();

    currentUser = Parse.User.current();

    loaderFunc(false, undefined);

    var href = "index.html";
    window.location.href = href;
};