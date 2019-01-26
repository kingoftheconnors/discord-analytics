
# Install NPM packages
npm install

# Create databases
psql -c 'create database discordanalytics_dev;'

# Migrate databases
node ./node_modules/.bin/knex migrate:latest
