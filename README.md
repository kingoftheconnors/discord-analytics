# discord-analytics

[![CircleCI](https://circleci.com/gh/kingoftheconnors/discord-analytics.svg?style=svg&circle-token=81bf6e50dc29dbc9abbbf067d53f5cdf7dac214e)](https://circleci.com/gh/kingoftheconnors/discord-analytics)

## This bot understands the following commands

Note: `<username>` should be a user mention. e.g. `@foobar#1234`

```
# Determines when a user is most likely to be available
!available <username> <weekday>

# Shows user chat activity by day
!chat <username> 

# Shows user chat activity by hour on a particular weekday
!chat <username> <weekday>

# Shows day and time user is most active
!active <username>

# Shows time user is most active on a particular day
!active <username> <weekday>

# Shows number of attachments throughout the entire server
!attachments

# Shows number of attachments posted by a particular user
!attachments <username>
```

## Requirements

 - Node.js
 - PostgreSQL (`postgres` superuser with empty password)

## Hacking

```bash
# Copy config, edit where appropriate
cp .env.example .env

# Setup the application (unix)
bin/setup

# Setup the application (windows)
.\bin\setup.cmd

# Run main program
node app.js
```