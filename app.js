var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Set up middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
var db = new sqlite3.Database('./db/BTC.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Use routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/api/date',(req,res) => {
    db.all('SELECT * FROM price',(err,rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

module.exports = app;
