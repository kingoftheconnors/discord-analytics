// Load Highcharts
const exporter = require("highcharts-export-server");
const fs = require("fs");
const shortid = require("shortid");
const path = require("path");

function exportGraph(barArray, username) {
  var highChart = {
    type: "png",
    options: {
      chart: {
        type: "column"
      },
      title: {
        text: "Discord User Activity"
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
          text: "Regularity"
        }
      },
      series: [
        {
          data: barArray,
          name: "Activity for " + username
        }
      ]
    }
  };

  // The pool should already be initialized
  // exporter.initPool();

  // Perform an export
  var tmpFileName = path.join("./tmp", shortid.generate() + ".png");

  console.log(`Generating to ${tmpFileName}\n\n`);

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

module.exports = exportGraph;
