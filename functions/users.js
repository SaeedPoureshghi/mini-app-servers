const db = require('../db');

const levels = [
    "Earthly Abode",
    "Sanctuary",
    "Haven",
    "Elysium",
    "Zion",
    "Nirvana",
    "Eden",
    "Celestial Realm",
    "Heavenly Garden",
    "Paradise"
  ];

  const levelupcoin = [
    1500,
    5000,
    15000,
    50000,
    150000,
    400000,
    1000000,
    5000000,
    20000000,
    50000000
    ];

    
    // set array of maxtaps according to the levelupcoin array start from 50
    const maxtap = levelupcoin.map((coin, index) => {
        return 50 + (index * 5);
        });

    // set array of earntotap according to the levelupcoin array start from 2
    const earntotap = levelupcoin.map((coin, index) => {
        return 2 + (index * 2);
        } );    



const isUserExist = async (user_id) => {

    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [user_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const createUser = async (user) => {

    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (user_id, first_name, last_name, username, file_id) VALUES (?,?,?,?,?)`, [user.id, user.first_name, user.last_name, user.username,user.file_id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const getUser = async (user_id) => {

    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [user_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const updateUser = async (user_id, data) => {

    return new Promise((resolve, reject) => {
        db.run(`UPDATE users SET earntotap = ?, totalcoin = ?, profitperhour = ?, currentlevel = ?, levelupcoin = ?, leveltext = ?, maxtap = ? WHERE user_id = ?`, [data.earntotap, data.totalcoin, data.profitperhour, data.currentlevel, data.levelupcoin, data.leveltext, data.maxtap, user_id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    isUserExist,
    createUser,
    getUser,
    updateUser,
    levels,
    levelupcoin,
    maxtap,
    earntotap
}
