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

function dangNhap(username,password,callback){
    db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], callback)
}


module.exports = dangNhap