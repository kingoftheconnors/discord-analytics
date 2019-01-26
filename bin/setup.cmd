
REM Install NPM packages
npm install

REM Create databases
psql -U postgres -c "create database discordanalytics_dev;"

REM Migrate databases
.\node_modules\.bin\knex.cmd migrate:latest
