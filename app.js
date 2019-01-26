require('dotenv').config()

const db = require('./config/db')
const exportGraph = require('./lib/chart')
const Discord = require('discord.js')
const moment = require('moment')
const client = new Discord.Client()
var userTimes = {}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('presenceUpdate', msg => {
  console.log(`${msg.user.username}#${msg.user.discriminator}: ${msg.user.presence.status}`)
  if (!userTimes[msg.user.username]) {
    userTimes[msg.user.username] = []
  }

  var importantStuff = {
    username: `${msg.user.username}#${msg.user.discriminator}`,
    status: msg.user.presence.status,
    timestamp: moment()
  }

  userTimes[msg.user.username].push(importantStuff)
});


client.on('message', msg => {
  var arguments = msg.content.split(" ")
  if (arguments[0] === '!stats') {
    console.log(userTimes)
    msg.channel.send(formatTimes())
  }
  if (arguments[0] === '!chart') {
    exportGraph([1, 6, 2, 3, 8, 20, 12, 9, 1, 2]);
    setImmediate(()=>{
      var chartAttachment = new Discord.Attachment('out.png')
      msg.channel.send("Here is an image:", chartAttachment)
    })
  }
  if (arguments[0] === '!available') {
    //var barArray = createGraph(arguments[1], arguments[2])
    //exportGraph(barArray);
    exportGraph([1, 6, 2, 3, 8, 20, 12, 9, 1, 2]);
    setImmediate(()=>{
      var chartAttachment = new Discord.Attachment('out.png')
      msg.channel.send("Here's " + arguments[1] + "'s chart:", chartAttachment)
    })
  }

})

client.login(process.env.BOT_TOKEN)

function formatTimes() {
  var retVal = ""
  Object.keys(userTimes).forEach( (username) =>{
    userTimes[username].forEach( (event) => {
      retVal += `${event.username}: ${event.status} at ${event.timestamp.format()}\n`
    })
  })
  
  return retVal
}
/*
function createGraph(username, timeStamp) {
  var hour = 0;
  var onlineSwitch = true;
  var curDay = 0;

  var barArray = new Array(24).fill(0);

  //For all records for username on weekday...

  {
    //Boolean variable that is true when online and false when offline
    onlineSwitch = 
    //Moment.js object
    var curStamp = 

    //Check if this stamp's day is a week later than the current one
    if(curStamp.date() != curDay) {
      hour = 0;
      curDay = curStamp.date()
    }

    //If online, set hour
    if(onlineSwitch == true) {
      hour = curStamp.hour()
    }
    else {
      //If offline, increment all values between hour and time stamp
      for(var i=hour; i < curStamp.hour(); i++) {
        barArray[i]++
      }
    }
  }

  //If day ends and user is online, go from hour to 23 and increment
  if(onlineSwitch == true) {
    for(var i=hour; i < 24; i++) {
      barArray[i]++
    }
  }

  return barArray
}
*/