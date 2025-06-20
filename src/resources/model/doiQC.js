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

function doiQC(idQC,username,callback){
    db.query('UPDATE useruse, user SET idQC = ?  WHERE useruse.idUser = user.id AND user.taiKhoan = ?'
        ,[idQC,username], callback)
}


module.exports = doiQC