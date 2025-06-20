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

function khungSH(userName,callback){
    db.query('SELECT idKhung FROM user, sohuukhung '+
		'WHERE user.id = sohuukhung.idUser AND user.taiKhoan = ?'
		,[userName], callback)
	
}


module.exports = khungSH