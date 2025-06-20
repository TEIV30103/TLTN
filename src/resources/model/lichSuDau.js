const express = require('express')
const session = require('express-session');
const db = require('./connect_DB')

const app = express()

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

function LSD(username,callback){
    db.query('SELECT * FROM lichsudau WHERE User1 = ? OR User2 = ? ORDER BY id DESC LIMIT 10',[username,username], callback)
}


module.exports = LSD