
/*
 * GET users listing.
 */

mongoose = GLOBAL.mongoose;

User = mongoose.model('User', {
    nick: String,
    profile_picture: String,
    current_room: String,
    online: Boolean
});

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.logged_in = function(req, res){
  res.json(req.user || false);
}

exports.serialize = function(user, done) {
  done(null, user.id);
}

exports.deserialize = function(user_id, done) {
  User.findById(user_id, done);
}

function pad(n, width, z) {
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
      n = new User({
          nick: profile.displayName,
          profile_picture: 'http://graph.facebook.com/'+profile.id+'/picture?type=square',
          _id: pad(profile.id, 24),
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
