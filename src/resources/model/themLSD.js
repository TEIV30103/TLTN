const express = require('express')
const session = require('express-session');
const db = require('../model/connect_DB')

const app = express()

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

function themLSD(user1,user2,userwin,callback){
    getUserIdByName(user1, function(err, user1Id) {
        if (err) return callback(err);
        getUserIdByName(user2, function(err2, user2Id) {
            if (err2) return callback(err2);
            const thoiGian = getCurrentTimeString();
            if(userwin == user1){
                db.query('INSERT INTO lichsudau (User1, User2, UserWin, thoiGian) VALUES (?, ?, ?, ?)', [user1Id, user2Id, user1Id, thoiGian], function(err3, results) {
                    if (err3) return callback(err3);
                    callback(null, results);
                });
            }else if(userwin == user2){
                db.query('INSERT INTO lichsudau (User1, User2, UserWin, thoiGian) VALUES (?, ?, ?, ?)', [user1Id, user2Id, user2Id, thoiGian], function(err3, results) {
                    if (err3) return callback(err3);
                    callback(null, results);
                });
            }
        });
    });
}

function getCurrentTimeString() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
}

function getUserIdByName(userName, callback) {
    db.query('SELECT id FROM user WHERE ten = ?', [userName], function(err, results) {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('Không tìm thấy user'));
        callback(null, results[0].id);
    });
}


module.exports = themLSD