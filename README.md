# discord-analytics

## Requirements

 - Node.js
 - PostgreSQL

## Getting started

```bash
# Copy config, edit where appropriate
cp .env.example .env

# Migrate database
bin/knex migrate:latest

# Run main program
node main.js
```