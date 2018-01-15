/**
 * Created by RiccardoCh on 27/01/16.
 */

var sensor_unity = "°C";


// SAVE EVENT
var saveEvent = function () {

    console.log("Start Time: " + $('#start_clock_input').val());
    console.log("End Time: " + $('#end_clock_input').val());
    console.log("Value: " + $('#value_input').val());

    var options = {
        content: 'Save complete!',
        color: 'green',
        audio: '../JBox/audio/bling1',
        volume: 100,
        attributes: {y: 'bottom'}
    };
    new jBox('Notice', options);
};

var setEventBox;
function setEventPopUp() {
    setEventBox.open();
};


$(document).ready(function () {

    var clock1 =
        '<h4 style="text-align: left"><b>Start Time</b></h4>' +
        '<div class="input-group">' +
        '<input id="start_clock_input" type="time" data-clear-btn="true" class="form-control" value="">' +
        '<span class="input-group-addon">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        '</span>' +
        '</div>';

    var clock2 =
        '<h4 style="text-align: left"><b>End Time</b></h4>' +
        '<div class="input-group">' +
        '<input id="end_clock_input" type="time" data-clear-btn="true" class="form-control" value="">' +
        '<span class="input-group-addon">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        '</span>' +
        '</div>';

    var valueInput =
        '<h4 style="text-align: left"><b>Value (' + sensor_unity + ')</b></h4>' +
        '<div class="input-group">' +
        '<input id="value_input" type="number" step="0.01" min="-20" data-clear-btn="true" class="form-control" value="10:10">' +
        '<span class="input-group-addon">' +
        '<span class="glyphicon glyphicon-pencil"></span>' +
        '</span>' +
        '</div>';

    var content = clock1 + clock2 + valueInput;


    var b_width = document.body.offsetWidth;
    var b_height = document.body.offsetHeight;
    var options = {
        width: b_width / 2,
        height: 320,
        //attach: $('#setEvent'),
        title: 'Set Event',
        content: content,
        confirmButton: 'Save',
        cancelButton: 'Cancel',
        confirm: saveEvent
    };
    setEventBox = new jBox('Confirm', options);

});


Event = function (day, startTime, endTime, value) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
    this.value = value;
};


// CREATE EVENT
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
setEvent = function (day, hour) {
    console.log("Day: " + day);
    console.log("Hour: " + hour);

    var eventIsChecked = $('#event_' + day + "_" + hour).is(":checked");

    if (eventIsChecked) {

        // OPEN POPUP
        setEventBox.open();

        // SET TIME VALUE
        var startTime = hour + "";
        if (hour < 10) {
            startTime = "0" + hour;
        }
        $('#start_clock_input').val(startTime + ":00");


        var endTime = (hour + 1) + "";
        if ((hour + 1) < 10) {
            endTime = "0" + (hour + 1);
        }
        $('#end_clock_input').val(endTime + ":00");
    }
}
;

