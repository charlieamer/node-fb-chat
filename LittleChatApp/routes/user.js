
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

function getOnlineUsers(room, done)
{
  User.find({online: true, current_room: room}, done);
}

function doneResponse(res)
{
  return function(err, obj)
  {
    if (err)
      console.error('Error in doneResponse: ', err);
    res.json(obj);
  }
}

function changeUserStatus(id, room, status)
{
  User.findById(id, function(err, user) {
    user.online = status;
    user.save(function(err){
      console.log(user.displayName, "\tonline:", status);
      if (err)
        console.error("but, there was an error:", err);
      releaseOnlineUsersQueue(room);
    });
  });
}


function makeUserOffline(id, room)
{
  changeUserStatus(id, room, false);
}

function makeUserOnline(id, room)
{
  changeUserStatus(id, room, true);
  heartbeatUser(id, room);
}

heartbeats = {};
online_users_queue = {};

function releaseOnlineUsersQueue(room)
{
  getOnlineUsers(room, function(err, response) {;
    if (online_users_queue[room])
      online_users_queue[room].forEach(function(res)
      {
        res.json(response);
      });
  });
}

function heartbeatUser(id, room)
{
  if (heartbeats[id])
    clearTimeout(heartbeats[id]);
  heartbeats[id] = setTimeout(function(){
    makeUserOffline(id, room);
  }, 15000);
}


exports.heartbeat = function(req, res) {
  if (req.user.online)
    heartbeatUser(req.user.id, req.user.current_room);
  else
    makeUserOnline(req.user.id, req.user.current_room);
  res.send("");
}

exports.list = function(req, res){
  getOnlineUsers(req.user.current_room, doneResponse(res));
};

exports.wait_change = function(req, res){
  online_users_queue[req.user.current_room] = online_users_queue[req.user.current_room] || [];
  online_users_queue[req.user.current_room].push(res);
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
      makeUserOnline(user.id, user.current_room);
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
        makeUserOnline(n._id, n.current_room);
      });
    }
  });
}
