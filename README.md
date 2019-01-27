# discord-analytics

[![CircleCI](https://circleci.com/gh/kingoftheconnors/discord-analytics.svg?style=svg&circle-token=81bf6e50dc29dbc9abbbf067d53f5cdf7dac214e)](https://circleci.com/gh/kingoftheconnors/discord-analytics)

## This bot understands the following commands:

```
# Determines when a user is most likely to be available
!available <username> <weekday>

# Shows chat activity by weekday for a user
!chat <username>

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