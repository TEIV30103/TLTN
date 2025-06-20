const path = require('path')
const express = require('express')
const session = require('express-session');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const http = require('http')

const route = require('./resources/routes')
// const db = require('./resources/model/connect_DB')
const app = express()

const server = http.createServer(app)
const io = require('socket.io')(server);
const socket = require('./resources/public/socket')

const port = 3000

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'resources/public')))

app.use(morgan('combined'))

app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: function(a, b) { return a == b; }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'))

route(app)
socket(io)


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})