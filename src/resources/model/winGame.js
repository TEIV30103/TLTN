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

function winGame(userName,callback){
    db.query('UPDATE diem,user SET diem.diem = diem.diem +1 '
        +'WHERE diem.idUser = user.id AND user.ten = ?'
        ,[userName],callback)
}


module.exports = winGame