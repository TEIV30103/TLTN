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

function muaAvatar(idAvt,username,callback){
    db.query('INSERT INTO sohuuavt(idUser, idAvt) '+
            'SELECT id, ? FROM user WHERE user.taiKhoan = ?'
            ,[idAvt,username], callback)
}


module.exports = muaAvatar