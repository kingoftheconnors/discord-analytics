# discord-analytics

[![CircleCI](https://circleci.com/gh/kingoftheconnors/discord-analytics.svg?style=svg&circle-token=81bf6e50dc29dbc9abbbf067d53f5cdf7dac214e)](https://circleci.com/gh/kingoftheconnors/discord-analytics)

## Requirements

 - Node.js
 - PostgreSQL (`postgres` superuser with empty password)

## Getting started

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