var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '1473186776279007',
    clientSecret: '673b23abaf35144585013b15a95ed136',
    callbackURL: "http://localhost:5005/fb_loggedIn"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

exports.passport = passport;
exports.logIn = passport.authenticate('facebook');
exports.loggedIn = passport.authenticate('facebook', { successRedirect: '/index.html#/chat/public',
    failureRedirect: '/failure' });

all_users = {};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
