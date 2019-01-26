require("dotenv").config();

const db = require("./config/db");
const exportGraph = require("./lib/chart");
const { getDayNumber, getDayName } = require("./lib/time");
const Discord = require("discord.js");
const moment = require("moment");
const exporter = require("highcharts-export-server");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Start a pool of PhantomJS workers (for rendering charts)
  exporter.initPool();
});

client.on("presenceUpdate", msg => {
  var activityRecord = {
    username: msg.user.tag,
    status: msg.user.presence.status,
    timestamp: moment()
  };

  // Save to database
  db("user_activity")
    .insert(activityRecord)
    .then(_result => {
      console.log("Saved activity: ", activityRecord);
    })
    .catch(error => {
      console.log("Failed to save activity: ", activityRecord, error);
    });
});

client.on("message", msg => {
  var command = msg.content.split(" ");

  if (command[0] === "!available") {
    if (command.length < 2) {
      msg.channel.send(
        "Please specify a username. Example: `!available foobar#1234 26`"
      );
      return;
    }

    if (command.length < 3) {
      msg.channel.send(
        "Please specify a day. Example: `!available foobar#1234 26`"
      );
      return;
    }

    var username = command[1];
    var day = getDayNumber(command[2]);
    if (day === false) {
      msg.channel.send(
        "Invalid day specified. Please enter a valid day e.g. `Sunday, Monday`"
      );
      return;
    }
    createGraph(msg, username, day);
  }

  if (command[0] === "!active") {
    if (command.length < 2) {
      msg.channel.send(
        "Please specify a user and day. Example: `!active foobar#1234 Sunday, ect...`"
      );
      return;
    }
    if (command.length == 2) {
      getBestTimeAndDay(msg, command[1]);
    }
    if (command.length == 3) {
      var day = getDayNumber(command[2]);
      if (day === false) {
        msg.channel.send(
          "Invalid day specified. Please enter a valid day e.g. `Sunday, Monday`"
        );
        return;
      }

      getBestTime(msg, command[1], day);
    }
  }
});

// Handle disconnection gracefully
client.on("disconnect", _evt => {
  console.log("Disconnected");

  exporter.killPool();
});

// Handle interrupts gracefully
process.on("SIGINT", _evt => {
  console.log("Caught interrupt signal, terminating");

  client.destroy();
  exporter.killPool();
  process.exit();
});

client.login(process.env.BOT_TOKEN);

function createGraph(msg, username, day) {
  //
  db.select()
    .table("user_activity")
    .where({ username: username })
    .whereRaw("extract(dow from timestamp) = ?", day)
    .then(rows => {
      if (!(rows.length > 0)) {
        msg.channel.send(`No such user online on that day: ${username}`);
        return;
      }

      var barArray = getActiveTimes(rows, day);

      // Export graph data to a file
      console.log(barArray);
      exportGraph(barArray, username).then(
        exportedChartFileName => {
          var chartAttachment = new Discord.Attachment(exportedChartFileName);
          msg.channel.send("Here's " + username + "'s chart:", chartAttachment);
        },
        err => {
          msg.channel.send("An error occurred while generating this chart.");
          console.log(err);
        }
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${username}.`
      );
      console.log(error);
    });
}

function getBestTimeAndDay(msg, username) {
  var mostActiveTime = 0;
  var activeLevel = 0;
  var mostActiveDay = "not available";

  db.select()
    .table("user_activity")
    .where({ username: username })
    .then(rows => {
      if (!(rows.length > 0)) {
        msg.channel.send(`No such user online on that day: ${username}`);
        return;
      }
      for (var day = 0; day < 7; day++) {
        var barArray = getActiveTimes(rows, day);
        barArray.forEach((element, index) => {
          if (element > activeLevel) {
            mostActiveTime = index;
            activeLevel = element;
            mostActiveDay = getDayName(day);
          }
        });
      }

      // Export graph data to a file
      msg.channel.send(
        `Most active time for ${username} is ${mostActiveTime}:00 on ${mostActiveDay}s.`
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${username}.`
      );
      console.log(error);
    });
}

function getBestTime(msg, username, day) {
  //
  db.select()
    .table("user_activity")
    .where({ username: username })
    .whereRaw("extract(dow from timestamp) = ?", day)
    .then(rows => {
      if (!(rows.length > 0)) {
        msg.channel.send(`No such user online on that day: ${username}`);
        return;
      }

      var mostActiveTime = 0;
      var activeLevel = 0;
      var barArray = getActiveTimes(rows, day);
      barArray.forEach((element, index) => {
        if (element > activeLevel) {
          mostActiveTime = index;
          activeLevel = element;
        }
      });

      // Export graph data to a file
      msg.channel.send(
        `Most active time for ${username} on ${getDayName(
          day
        )}s is ${mostActiveTime}.`
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${username}.`
      );
      console.log(error);
    });
}

function getActiveTimes(rows, day) {
  var hour = 0;
  var prevSwitch = false;
  var onlineSwitch = false;
  var curDay = 0;

  var barArray = new Array(24).fill(0);

  //For all records for username on weekday...
  rows.forEach(event => {
    if (moment(event.timestamp).day() == day) {
      //Boolean variable that is true when online and false when offline
      prevSwitch = onlineSwitch;
      onlineSwitch = event.status === "online";
      //Moment.js object
      var curStamp = moment(event.timestamp);

      //Check if this stamp's day is a week later than the current one
      if (curStamp.date() != curDay) {
        //If day ends and user is online, go from hour to 23 and increment
        if (prevSwitch == true) {
          for (var i = hour; i < 24; i++) {
            barArray[i]++;
          }
        }
        hour = 0;
        curDay = curStamp.date();
      }

      //If online, set hour
      if (onlineSwitch == true) {
        hour = curStamp.hour();
      } else if (prevSwitch == true) {
        //If offline, increment all values between hour and time stamp
        for (var i = hour; i <= curStamp.hour(); i++) {
          console.log("Adding 1 to " + i);
          barArray[i]++;
        }
      }
    }
  });

  //If day ends and user is online, go from hour to 23 and increment
  if (onlineSwitch == true) {
    for (var i = hour; i < 24; i++) {
      barArray[i]++;
    }
  }

  return barArray;
}
