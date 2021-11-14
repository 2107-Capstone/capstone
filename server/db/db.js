const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const config = {
  logging: false
};

if (process.env.LOGGING === 'true') {
  delete config.logging
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  };
}

///////// Added this part just to run on my windows PC. - John ///////////////
const pass = process.env.PASS;
const user = process.env.USER;
let winPC;
if (user && pass) {
  winPC = `${user}:${pass}@`
}
else {
  winPC = '';
}

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://${winPC}localhost:5432/${databaseName}`, config)
module.exports = db
