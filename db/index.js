const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./db.sqlite');

module.exports = db;