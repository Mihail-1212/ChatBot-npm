const pgp = require("pg-promise")(/*options*/);

const dbConfig = require("../config/connection");

// Initial database variables
const username = dbConfig.username,
  password = dbConfig.password,
  host = dbConfig.host,
  port = dbConfig.port,
  database = dbConfig.databaseName;

// DB open connection
const db = pgp(`postgres://${username}:${password}@${host}:${port}/${database}`);

module.exports = db;