require("dotenv").config();

const db = require("./config/db");
const exportGraph = require("./lib/chart");
const Discord = require("discord.js");
const moment = require("moment");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
  if (command[0] === "!stats") {
    if (command.length < 2) {
      msg.channel.send(
        "Please specify a username. Example: `!stats foobar#1234`"
      );
      return;
    }

    var username = command[1];

    db.select()
      .table("user_activity")
      .where({ username: username })
      .then(rows => {
        if (!(rows.length > 0)) {
          msg.channel.send(`No such user: ${username}`);
          return;
        }

        var responseMsg = "";
        rows.forEach(event => {
          timestamp = moment(event.timestamp).format();
          responseMsg += `${event.username}: ${event.status} at ${timestamp}\n`;
        });

        msg.channel.send(responseMsg);
      })
      .catch(error => {
        msg.channel.send(
          `An error occurred while fetching activity for ${username}.`
        );
        console.log(error);
      });
  }

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
    var dayName = command[2].toLowerCase();
    if (!dayMap.hasOwnProperty(dayName)) {
      msg.channel.send(
        "Invalid day specified. Please enter a valid day e.g. `Sunday, Monday`"
      );
      return;
    }
    var day = dayMap[dayName];
    createGraph(msg, username, day);
  }
});

var dayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

client.login(process.env.BOT_TOKEN);

function createGraph(msg, username, day) {
  var hour = 0;
  var prevSwitch = false;
  var onlineSwitch = false;
  var curDay = 0;

  var barArray = new Array(24).fill(0);

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

      //For all records for username on weekday...
      rows.forEach(event => {
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
      });

      //If day ends and user is online, go from hour to 23 and increment
      if (onlineSwitch == true) {
        for (var i = hour; i < 24; i++) {
          barArray[i]++;
        }
      }

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
