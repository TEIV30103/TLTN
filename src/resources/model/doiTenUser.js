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

function doiTen(ten,username,callback){
    db.query('UPDATE user SET ten = ? WHERE user.taiKhoan = ?'
        ,[ten,username], callback)
}


module.exports = doiTen