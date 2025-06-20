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

function doiAvatar(idAvt,username,callback){
    db.query('UPDATE useruse, user SET idAvt = ?  WHERE useruse.idUser = user.id AND user.taiKhoan = ?'
        ,[idAvt,username], callback)
}


module.exports = doiAvatar