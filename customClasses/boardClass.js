/**
 * Created by RiccardoCh on 21/12/15.
 */


// BOARD CLASS
function Board(name, ip) {

    this.id = "";

    this.name = name;
    this.localip = ip;
    this.remoteip = "";

    this.description = "";
    this.email = "";

    this.language = "";
    this.location = new Parse.GeoPoint(0, 0);
    this.locationName = "";

    this.model = 0;
    this.reference = 0;

    this.sender_email = "";
    this.sender_password = "";

    this.image = "";

    this.userId = "";

    this.getInfo = function () {
        return this.name + ': ' + this.localip;
    };

    this.sensors = [];
    this.inputs = [] ;
    this.outputs = [];
    this.virtualInputs = [];
    this.alarmState = false;

    this.isOnline = false;

    this.lastSync = new Date()
}


function output(name, type) {
    this.name = name;
    this.type = type;

    this.number = -1;
    this.notification = "";

    this.value = 0;
    this.id = 0;

    this.delayBeforeSendingPush = 5;
    this.pushMessage = "";
    this.pushActivated = 0;
    this.statusForSendingPush = 0;
}

function sensor(name, type) {
    this.name = name;
    this.type = type;

    this.number = -1;
    this.notification = "";

    this.value = 0.0;
    this.id = 0;

    this.setValue = 20.0;
    this.thresholdState = 0;

    this.out1 = -1;
    this.out2 = -1;

    this.database = false;

    this.delayBeforeSendingPush = 5;
    this.pushMessage = "";
    this.pushActivated = 0;
    this.statusForSendingPush = 0;
    this.pushSensorValue = 0.0;

    this.getUnity = function () {
        var unity = "";
        switch (this.type) {
            case 0:
                unity = "";
                break;
            case 1:
            case 4:
            case 6:
                unity = "°C";
                break;
            case 2:
            case 5:
            case 7:
                unity = "%";
                break;
            default:
                unity = "";
                break;
        }
        return unity;
    }
}


function sensorDatabaseValue(date, value){
    this.date = date;
    this.value = value;

    this.max = 0;
    this.min = 0;
    this.variance = 0;
}

function input(name, type) {
    this.name = name;
    this.type = type;

    this.number = -1;

    this.value = 0;
    this.id = 0;

    this.outputToActivate = [];

    this.delayBeforeSendingPush = 5;
    this.pushMessage = "";
    this.pushActivated = 0;
    this.statusForSendingPush = 0;

    this.getState = function () {
        var state = "OFF";
        if (this.value == 0) {
            state = "OFF";
        }
        else {
            state = "ON";
        }
        return state;
    }
}


function virtualInput(name, type) {
    this.name = name;
    this.desc = "";

    this.value = 0;
    this.id = 0;
}
