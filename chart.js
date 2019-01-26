// Load Highcharts
const exporter = require('highcharts-export-server')
const fs = require('fs')
 
//Export settings
var exportSettings = {
  type: 'png',
  options: {
      title: {
          text: 'My Chart'
      },
      xAxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      series: [
          {
              type: 'line',
              data: [1, 3, 2, 4]
          },
          {
              type: 'line',
              data: [5, 3, 4, 2]
          }
      ]
  }
};
 
//Set up a pool of PhantomJS workers
exporter.initPool();

//Perform an export
exporter.export(exportSettings, function (err, res) {
    var outData = new Buffer(res.data, 'base64')
    fs.writeFileSync('out.png', outData)

    //Kill the pool when we're done with it, and exit the application
    exporter.killPool();
    process.exit(1);
});