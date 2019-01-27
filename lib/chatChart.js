// Load Highcharts
const exporter = require("highcharts-export-server");
const fs = require("fs");
const shortid = require("shortid");
const path = require("path");

// Presence events, hourly
function exportGraph(barArray, username) {
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
      }

      var outData = new Buffer(res.data, "base64");
      fs.writeFileSync(tmpFileName, outData);
      resolve(tmpFileName);
    });
  });
}

// Text chat, weekly
function exportWeeklyGraph(barArray, username) {
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
          data: barArray[0],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[1],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[2],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[3],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[4],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[5],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[6],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[7],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[8],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[9],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[10],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[11],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[12],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[13],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[14],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[15],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[16],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[17],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[18],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[19],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[20],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[21],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[22],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
          name: "Chat Activity for " + username
        },
        {
          data: barArray[23],
          color: [
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500",
            "#FFA500"
          ],
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
      }

      var outData = new Buffer(res.data, "base64");
      fs.writeFileSync(tmpFileName, outData);
      resolve(tmpFileName);
    });
  });
}

module.exports = { exportGraph, exportWeeklyGraph };
