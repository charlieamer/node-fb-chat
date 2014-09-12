/*
 * GET users in room
 * GET last 10 messages in room
 */

var User = require('./user').User;
var mongoose = GLOBAL.mongoose;
var Message = mongoose.model("Message", {
    "_id": String,
    "from": String,
    "message": String,
    "room": String,
    "on_time": Date
});

var waiting_list = {};
var msg_count = "0";

function myJsonConverter(obj)
{
  return JSON.parse(JSON.stringify(obj.toJSON()));
}

exports.new_message = function (req, res) {

    res.send("");
    var message = req.body.message;
    Message.count({}, function (err, count) {
        msg_count = count;
        if (waiting_list[msg_count])
            waiting_list[msg_count].forEach(function (f) {
                f.json({
                    "_id": msg_count.toString(),
                    "from": req.user,
                    "message": message,
                    "room": "public",
                    "on_time": new Date().getTime()
                });
            });
        waiting_list[msg_count] = [];
        
        var m = new Message({
            "_id": GLOBAL.pad(msg_count.toString(), 24, '0'),
            "from": req.user.id,
            "message": message,
            "room": req.user.current_room,
            "on_time": new Date()
        });
        m.save(function (err) {
        });
    });
};
//LOGIN                  weq
exports.last_messages = function (req, res) {
    Message
        .find({ "room": req.user.current_room })
        .sort({ '_id': -1 })
        .limit(10)
        .exec(function (err, raw_msgs) {

        msgs = [];
        
        raw_msgs.forEach(function (f) {
            f._id = parseInt(f._id);
            msgs.push(myJsonConverter(f));
        });

        var user_cache = {};

        rec = function rec(num)
        {
          if (!msgs[num])
          {
            res.json(msgs.reverse());
          }
          else
          {
            if (user_cache[msgs[num].from])
            {
              msgs[num].from = user_cache[msgs[num].from];
              rec(num+1);
            } else
              User.findOne(msgs[num].from, function(err, user){
                user_cache[msgs[num].from] = user;
                if (!err)
                  msgs[num].from = user.valueOf();
                rec(num+1);
              });
          }
        }

        rec(0);
    });
    
};

exports.get_messages = function (req, res) {
    var id = parseInt(req.params.id);
    //Check if the message already exists
    Message.findOne({ "_id": GLOBAL.pad(id.toString(), 24, '0') }, function (err, msg) {
        if (!err && msg && msg != null) {
            msg._id = parseInt(msg._id);
            res.json(msg);
            return;
        }
        waiting_list[id] = waiting_list[id] || [];
        waiting_list[id].push(res);
    });

};

exports.render=function(req,res){
    res.render('chat/index');
};
