const moment = require("moment");

function getActiveTimes(rows, day) {
  var hour = 0;
  var minute = 0;
  var prevSwitch = false;
  var onlineSwitch = false;
  var curDay = 0;

  var barArray = new Array(24).fill(0);

  //For all records for username on weekday...
  rows.forEach(event => {
    //Moment.js object
    event.timestamp = moment(event.timestamp);

    if (event.timestamp.day() == day) {
      //Boolean variable that is true when online and false when offline
      prevSwitch = onlineSwitch;
      onlineSwitch = event.status === "online";

      //Check if this stamp's day is a week later than the current one
      if (event.timestamp.date() != curDay) {
        //If day ends and user is online, go from hour to 23 and increment
        if (prevSwitch) {
          for (var i = hour; i < 24; i++) {
            barArray[i]++;
          }
        }
        hour = 0;
        minute = 0;
        curDay = event.timestamp.date();
      }

      //If online, set hour
      if (onlineSwitch) {
        hour = event.timestamp.hour();
        minute = event.timestamp.minute();
      } else {
        //If offline, increment all values between hour and time stamp
        for (var i = hour; i <= event.timestamp.hour(); i++) {
          //If there is little distance between signing on and off, don't count 5-minute visits
          if (
            !(hour == event.timestamp.hour() &&
            event.timestamp.minute() - minute < 10)
          ) {
            barArray[i]++;
          }
        }
      }
    }
  });

  //If records end and user is online, go from hour to 23 and increment
  if (onlineSwitch) {
    for (var i = hour; i < 24; i++) {
      barArray[i]++;
    }
  }

  return barArray;
}

module.exports = getActiveTimes;
