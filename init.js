const db = require('./db');

const {levels , levelupcoin, maxtap, earntotap} = require('./functions/users');

/* Initialize the database */

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        file_id TEXT,
        earntotap INTEGER DEFAULT ${earntotap[0]},
        totalcoin INTEGER DEFAULT 100,
        profitperhour INTEGER DEFAULT 0,
        currentlevel INTEGER DEFAULT 1,
        levelupcoin INTEGER DEFAULT ${levelupcoin[0]},
        leveltext TEXT DEFAULT '${levels[0]}',
        maxtap INTEGER DEFAULT ${maxtap[0]}
    )`, (err) => {
        if (err) {
            console.log(err);
        }else{
            console.log('Table users created successfully');
        }
    });
});