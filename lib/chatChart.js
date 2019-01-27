// Load Highcharts
const exporter = require("highcharts-export-server");
const fs = require("fs");
const shortid = require("shortid");
const path = require("path");

// Presence events, hourly
function exportChat(barArray, username) {
  var highChart = {
    type: "png",
    options: {
      credits: {
        enabled: false
      },
      chart: {
        type: "column"
      },
      title: {
        text: "Messages by Hour"
      },
      xAxis: {
        categories: [
          "12",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11"
        ]
      },
      yAxis: {
        title: {
          text: "Number of Messages"
        }
      },
      series: [
        {
          data: barArray,
          color: ["#FFA500", "#FFA500"],
          name: "Chat Activity for " + username
        }
      ]
    }
  };

  // Perform an export
  var tmpFileName = path.join("./tmp", shortid.generate() + ".png");

  return new Promise((resolve, reject) => {
    exporter.export(highChart, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      var outData = new Buffer(res.data, "base64");
      fs.writeFileSync(tmpFileName, outData);
      resolve(tmpFileName);
    });
  });
}

// Text chat, weekly
function exportWeeklyChat(barArray, username) {
  var highChart = {
    type: "png",
    options: {
      credits: {
        enabled: false
      },
      chart: {
        type: "column"
      },
      title: {
        text: "Messages by Day"
      },
      xAxis: {
        categories: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
      },
      yAxis: {
        title: {
          text: "Number of Messages"
        }
      },
      series: [
        {
          data: barArray,
          color: "#FFA500",
          name: "Chat Activity for " + username
        }
      ]
    }
  };

  // Perform an export
  var tmpFileName = path.join("./tmp", shortid.generate() + ".png");

  return new Promise((resolve, reject) => {
    exporter.export(highChart, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      var outData = new Buffer(res.data, "base64");
      fs.writeFileSync(tmpFileName, outData);
      resolve(tmpFileName);
    });
  });
}

module.exports = { exportChat, exportWeeklyChat };
