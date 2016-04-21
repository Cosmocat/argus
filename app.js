'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var app = express();

global.appRoot = path.resolve(__dirname);

require('./config/passport')(passport);
mongoose.connect('mongodb://localhost/news');

app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({ secret: 'secretcode' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./controllers'));
require('./controllers/login')(app, passport);

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.listen(8000, function () { console.log('listening');});