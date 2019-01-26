#!/usr/bin/env node

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('presenceUpdate', msg => {
  console.log(`${msg.user.username}#${msg.user.discriminator}: ${msg.user.presence.status}`);
});

client.login('token here');
