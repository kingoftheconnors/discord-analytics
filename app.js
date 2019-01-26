require('dotenv').config()
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

var chartAttachment = new Discord.Attachment('anychart.jpg')

client.on('message', msg => {
  if (msg.content === 'stats') {
    console.log(userTimes)
    msg.channel.send(formatTimes())
    msg.channel.send("Here is an image:", chartAttachment)
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

function createGraph() {
  var hour = 0;
  var onlineSwitch = true;

  var barArray = new Array(24).fill(0);

  //For all timeStamps for username on weekday...
    //If online, set hour

    //If offline, increment all values between hour and time stamp
    for(var i=hour; i < ; i++) {
    }

    //If day ends and user is online, go from hour to 23 and increment


  //Create graph
  
}
