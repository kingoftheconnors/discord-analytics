
REM Install NPM packages
npm install

REM Create databases
psql -c 'create database discordanalytics_dev;'

REM Migrate databases
node ./node_modules/.bin/knex migrate:latest
