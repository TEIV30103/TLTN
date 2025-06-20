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

function muaKhung(idKhung,username,callback){
    db.query('INSERT INTO sohuukhung(idUser, idKhung) '+
            'SELECT id, ? FROM user WHERE user.taiKhoan = ?'
            ,[idKhung,username], callback)
}


module.exports = muaKhung