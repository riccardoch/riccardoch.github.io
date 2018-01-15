var wsbroker = "www.smartface.it";
var wsport = 9995;
var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    console.log(message.destinationName, ' -- ', message.payloadString);
};

var options = {
    useSSL: true,
    userName: "smartface",
    password: "It1s@maz1n9",
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};

client.connect(options);

// POST REQUEST
postRequest = function (requestCmd, requestData, boardId, userId) {

    var json_data = {
        "requestCmd": requestCmd,
        "requestData": requestData,
        "boardId": boardId,
        "device": "Web App",
        "userId": userId
    };
    var message = new Paho.MQTT.Message(JSON.stringify(json_data));
    message.destinationName = "vaYrRaIRWA/request";

    console.log("Sending message:\n" + message);
    client.send(message);
};
