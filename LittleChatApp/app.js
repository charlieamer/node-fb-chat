
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var chat = require('./routes/chat');
var http = require('http');
var path = require('path');
var authorization = require('./routes/authorization');

var app = express();

// all environments
app.set('port', 5005);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: "hepek"}));
app.use(authorization.passport.initialize());
app.use(authorization.passport.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var auth = authorization.passport.authenticate('facebook');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/fb_login', authorization.logIn);
app.get('/fb_loggedIn', authorization.loggedIn);
app.get('/user', user.logged_in);

app.post('/chat/message', chat.new_message);
app.get('/chat/users', chat.list_users);
app.get('/chat/message/:id', chat.get_messages)

app.get('/heartbeat', function (req, res) {
    res.send("");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
