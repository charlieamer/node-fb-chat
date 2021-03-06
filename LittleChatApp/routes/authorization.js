var passport = require('passport')
  , user = require('./user')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '1473186776279007',
    clientSecret: '673b23abaf35144585013b15a95ed136',
    callbackURL: "http://localhost:5005/fb_loggedIn"
  },
  function(accessToken, refreshToken, profile, done) {
    user.findOrCreate(profile, done);
  }
));

exports.passport = passport;
exports.logIn = passport.authenticate('facebook');
exports.loggedIn = passport.authenticate('facebook', { successRedirect: '/chat/public',
    failureRedirect: '/failure' });

exports.mustLogIn = function(req, res, next) {
  if (!req.user)
    res.status(403).send("User not logged in");
  else
    next();
}

all_users = {};

passport.serializeUser(user.serialize);
passport.deserializeUser(user.deserialize);
