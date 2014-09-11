
/*
 * GET users listing.
 */

mongoose = GLOBAL.mongoose;

var User = mongoose.model('User', {
    displayName: String,
    profile_picture: String,
    current_room: String,
    online: Boolean
});

exports.list = function(req, res){
  res.json([req.user]);
};

exports.wait_change = function(req, res){
}

exports.logged_in = function(req, res){
  res.json(req.user || false);
}

exports.serialize = function(user, done) {
  done(null, user.id);
}

exports.deserialize = function(user_id, done) {
  User.findById(user_id, done);
}

GLOBAL.pad = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

exports.findOrCreate = function(profile, done) {
  User.findById(mongoose.Types.ObjectId(pad(profile.id, 24)), function(err, user) {
    if (!err && user)
    {
      console.log("existing user logged in: " + profile.displayName);
      done(null, user);
    }
    else
    {
      console.log("new user: " + profile.displayName);
      var n = new User({
          displayName: profile.displayName,
          profile_picture: 'http://graph.facebook.com/'+profile.id+'/picture?type=square',
          _id: GLOBAL.pad(profile.id, 24),
          current_room: 'public',
          online: true
      });
      n.save(function(err){
        console.log("saved successfuly");
        done(err, n);
      });
    }
  });
}
