require("dotenv").config();

const db = require("./config/db");
const exportGraph = require("./lib/chart");
const { exportChat, exportWeeklyChat } = require("./lib/chatChart");
const { getDayNumber, getDayName } = require("./lib/time");
const { ChatEvent, PresenceEvent } = require("./models");
const getActiveTimes = require("./lib/getActiveTimes");
const parseMention = require("./lib/parseMention");
const Discord = require("discord.js");
const moment = require("moment");
const exporter = require("highcharts-export-server");
const fs = require("fs");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Start a pool of PhantomJS workers (for rendering charts)
  exporter.initPool();
});

client.on("presenceUpdate", msg => {
  var presenceEvent = new PresenceEvent({
    user_id: msg.user.id,
    username: msg.user.tag,
    status: msg.user.presence.status
  });
  presenceEvent.save();
});

// TODO(tom): Save user ids
// hello <@121393624909873152>
client.on("message", msg => {
  // Persist the text chat event (no message contents)
  var chatEvent = new ChatEvent({
    user_id: msg.author.id,
    username: msg.author.tag,
    length: msg.content.length,
    attachments: msg.attachments.size,
    interaction_type: "text"
  });
  chatEvent.save();

  var command = msg.content.split(" ");

  if (command[0] === "!available") {
    if (command.length < 2) {
      msg.channel.send(
        "Please mention a username. Example: `!available @foobar#1234 Monday`"
      );
      return;
    }

    var userId = parseMention(command[1]);
    if (!userId) {
      msg.channel.send(
        "Please mention a valid username. Example: `!available @foobar#1234 Monday`"
      );
      return;
    }

    var user = msg.mentions.users.get(userId);

    if (command.length < 3) {
      msg.channel.send(
        "Please specify a day. Example: `!available @foobar#1234 Monday`"
      );
      return;
    }

    var day = getDayNumber(command[2]);
    if (day === false) {
      msg.channel.send(
        "Invalid day specified. Please enter a valid day. Example: `Sunday`"
      );
      return;
    }
    createGraph(msg, user, day);
  }

  if (command[0] === "!chat") {
    if (command.length < 2) {
      msg.channel.send(
        "Please specify a user and day. Example: `!active @foobar#1234 Sunday`"
      );
      return;
    }

    var userId = parseMention(command[1]);
    if (!userId) {
      msg.channel.send(
        "Please mention a valid username. Example: `!available @foobar#1234 Monday`"
      );
      return;
    }

    var user = msg.mentions.users.get(userId);

    if (command.length == 2) {
      //Weekly
      createWeeklyChatGraph(msg, user);
    }
    if (command.length == 3) {
      //Daily
      var day = getDayNumber(command[2]);
      if (day === false) {
        msg.channel.send(
          "Invalid day specified. Please enter a valid day e.g. `Sunday, Monday`"
        );
        return;
      }
      createChatGraph(msg, user, day);
    }
  }

  if (command[0] === "!active") {
    if (command.length < 2) {
      msg.channel.send(
        "Please specify a user and day. Example: `!active @foobar#1234 Sunday, ect...`"
      );
      return;
    }

    var userId = parseMention(command[1]);
    if (!userId) {
      msg.channel.send(
        "Please mention a valid username. Example: `!available @foobar#1234 Monday`"
      );
      return;
    }

    var user = msg.mentions.users.get(userId);

    if (command.length == 2) {
      getBestTimeAndDay(msg, user);
    }
    if (command.length == 3) {
      var day = getDayNumber(command[2]);
      if (day === false) {
        msg.channel.send(
          "Invalid day specified. Please enter a valid day e.g. `Sunday, Monday`"
        );
        return;
      }

      getBestTime(msg, user, day);
    }
  }

  if (command[0] === "!attachments") {
    if (command.length == 1) {
      ChatEvent.attachmentCount().then(
        result => {
          msg.channel.send(`Lifetime attachment count: ${result.sum}`);
        },
        err => {
          console.log(err);
          msg.channel.send("An error occurred while counting the attachments.");
        }
      );
    } else if (command.length == 2) {
      var userId = parseMention(command[1]);
      if (!userId) {
        msg.channel.send(
          "Please mention a valid username. Example: `!available @foobar#1234 Monday`"
        );
        return;
      }
      var user = msg.mentions.users.get(userId);

      ChatEvent.userAttachmentCount(user.id).then(
        result => {
          msg.channel.send(`${user.tag} has ${result.sum} attachments`);
        },
        err => {
          console.log(err);
          msg.channel.send(
            `An error occured while counting ${user.tag}'s attachments.`
          );
        }
      );
    } else {
      msg.channel.send(
        "Too many arguments. Please specify either user or no arguments. Example: `!active @foobar#1234`"
      );
      return;
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

function createGraph(msg, user, day) {
  //
  var rows = PresenceEvent.byDay(user.id, day);
  rows
    .then(rows => {
      if (!(rows.length > 0)) {
        dayName = getDayName(day);
        msg.channel.send(`${user.tag} is not online on ${dayName}s`);
        return;
      }

      var barArray = getActiveTimes(rows, day);

      // Export graph data to a file
      console.log(barArray);
      exportGraph(barArray, user.tag).then(
        exportedChartFileName => {
          var chartAttachment = new Discord.Attachment(exportedChartFileName);
          msg.channel
            .send("Here's " + user.tag + "'s chart:", chartAttachment)
            .then(_msg => {
              fs.unlinkSync(exportedChartFileName);
            })
            .catch(err => {
              console.log(err);
              fs.unlinkSync(exportedChartFileName);
            });
        },
        err => {
          msg.channel.send("An error occurred while generating this chart.");
          console.log(err);
        }
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${user.tag}.`
      );
      console.log(error);
    });
}

function createChatGraph(msg, user, day) {
  ChatEvent.byDay(user.id, day)
    .then(rows => {
      if (!(rows.length > 0)) {
        dayName = getDayName(day);
        msg.channel.send(`${user.tag} is not online on ${dayName}s.`);
        return;
      }

      var barArray = getChatTimes(rows, day);

      // Export graph data to a file
      console.log(barArray);
      exportChat(barArray, user.tag).then(
        exportedChartFileName => {
          var chartAttachment = new Discord.Attachment(exportedChartFileName);
          msg.channel
            .send("Here's " + user.tag + "'s chart:", chartAttachment)
            .then(_msg => {
              fs.unlinkSync(exportedChartFileName);
            })
            .catch(err => {
              console.log(err);
              fs.unlinkSync(exportedChartFileName);
            });
        },
        err => {
          msg.channel.send("An error occurred while generating this chart.");
          console.log(err);
        }
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${user.tag}.`
      );
      console.log(error);
    });
}

function createWeeklyChatGraph(msg, user) {
  ChatEvent.byWeek(user.id)
    .then(rows => {
      if (!(rows.length > 0)) {
        msg.channel.send(`${user.tag} hasn't posted any messages.`);
        return;
      }
      var barArray = new Array(7).fill(0);
      rows.forEach(chat_event => {
        chat_event.timestamp = moment(chat_event.timestamp);
        barArray[chat_event.timestamp.day()]++;
      });

      // Export graph data to a file
      console.log(barArray);
      exportWeeklyChat(barArray, user.tag).then(
        exportedChartFileName => {
          var chartAttachment = new Discord.Attachment(exportedChartFileName);
          msg.channel
            .send("Here's " + user.tag + "'s chart:", chartAttachment)
            .then(_msg => {
              fs.unlinkSync(exportedChartFileName);
            })
            .catch(err => {
              console.log(err);
              fs.unlinkSync(exportedChartFileName);
            });
        },
        err => {
          msg.channel.send("An error occurred while generating this chart.");
          console.log(err);
        }
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${user.tag}.`
      );
      console.log(error);
    });
}

function getBestTimeAndDay(msg, user) {
  var mostActiveTime = 0;
  var activeLevel = 0;
  var mostActiveDay = "not available";

  db.select()
    .table("user_activity")
    .where({ user_id: user.id })
    .then(rows => {
      if (!(rows.length > 0)) {
        msg.channel.send(`${user.tag} has no activity in known history`);
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
        `Most active time for ${
          user.tag
        } is after ${mostActiveTime}:00 on ${mostActiveDay}s.`
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${user.tag}.`
      );
      console.log(error);
    });
}

function getBestTime(msg, user, day) {
  //
  PresenceEvent.byDay(user.id, day)
    .then(rows => {
      if (!(rows.length > 0)) {
        var dayName = getDayName(day);
        msg.channel.send(`${user.tag} is not online on ${dayName}s.`);
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
        `Most active time for ${user.tag} on ${getDayName(
          day
        )}s is after ${mostActiveTime}.`
      );
    })
    .catch(error => {
      msg.channel.send(
        `An error occurred while fetching activity for ${user.tag}.`
      );
      console.log(error);
    });
}

function getChatTimes(rows, day) {
  var barArray = new Array(24).fill(0);

  //For all records for username on weekday...
  rows.forEach(event => {
    event.timestamp = moment(event.timestamp);
    if (event.timestamp.day() == day) {
      barArray[event.timestamp.hour()]++;
    }
  });

  return barArray;
}
