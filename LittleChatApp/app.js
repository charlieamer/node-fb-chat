
/**
 * Module dependencies.
 */

require('./db');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var chat = require('./routes/chat');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var favicon = require('express-favicon');
var json = require('express-json');
var bodyParser = require('body-parser');
var authorization = require('./routes/authorization');

var app = express();

// all environments
app.set('port', 5005);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(json());
app.use(cookieParser());
app.use(session({secret: "hepek"}));
app.use(authorization.passport.initialize());
app.use(authorization.passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

router.get('/', routes.index);
router.get('/api/users/wait_change', user.wait_change);
router.get('/api/users', user.list);
router.get('/fb_login', authorization.logIn);
router.get('/fb_loggedIn', authorization.loggedIn);
router.get('/api/user', user.logged_in);

router.post('/api/chat/message', chat.new_message);
router.get('/api/chat/message/:id', chat.get_messages)

router.get('/api/heartbeat', user.heartbeat);

app.use("/", router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
