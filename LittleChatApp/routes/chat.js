/*
 * GET users in room
 * GET last 10 messages in room
 */

var mongoose = GLOBAL.mongoose;
var Message = mongoose.model("Message", {
    "_id": String,
    "from": String,
    "message": String,
    "room": String,
    "on_time": Date
});

var waiting_list = {};

var slow_waiting_list = [];

exports.new_message = function (req, res) {
    
    res.send("");
    var message = req.body.message;
    var msg_count = "0";
    Message.count({}, function (err, count) { msg_count = count;
    slow_waiting_list.forEach(function (f) {
        f.json({
            "_id": msg_count.toString(),
            "from": req.user,
            "message": message,
            "room": "public",
            "on_time": new Date().getTime()
        });
    });   
    slow_waiting_list = [];
    
    var m = new Message({
        "_id": GLOBAL.pad(msg_count.toString(), 24, '0'),
        "from": req.user.id,
        "message": message,
        "room": req.user.current_room,
        "on_time": new Date()
    });
        m.save(function (err) {
            console.log("err " , err);
        
        });
    });
};

exports.last_messages = function (req, res) {
    res.json([]);
    models.Post
        .find({ published: true })
        .sort({ 'date': -1 })
        .limit(20)
        .exec(function (err, posts) {
             // `posts` will be of length 20
    });
    
};

exports.list_users = function (req, res) {
    res.json(['amerz','makunouchi','ganija']);
};

exports.wait_change = function (req, res) {
    
};

exports.get_messages = function (req, res) {
    var id = parseInt(req.params.id);
    waiting_list[id] = waiting_list[id] || [];
    waiting_list[id].push(res);

    slow_waiting_list.push(res);

};
