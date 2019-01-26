// Load Highcharts
const exporter = require("highcharts-export-server");
const fs = require("fs");

function exportGraph(barArray) {
  //Export settings
  var exportSettings = {
    type: "png",
    options: {
      title: {
        text: "My Chart"
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
      series: [
        {
          type: "column",
          data: barArray
        }
      ]
    }
  };

  //Set up a pool of PhantomJS workers
  exporter.initPool();

  //Perform an export
  exporter.export(exportSettings, function(err, res) {
    var outData = new Buffer(res.data, "base64");
    fs.writeFileSync("out.png", outData);

    /*
    //Kill the pool when we're done with it, and exit the application
    exporter.killPool();
    process.exit(1);
    */
  });
}

module.exports = exportGraph;