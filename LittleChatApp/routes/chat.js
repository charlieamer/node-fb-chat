/*
 * GET users in room
 * GET last 10 messages in room
 */

var waiting_list = {};

var slow_waiting_list = [];

exports.new_message = function (req, res) {
   
    var message = req.body.message;
    slow_waiting_list.forEach(function (f) {
        f.json(message);
    });
    res.send("");
    slow_waiting_list = [];
};

exports.last_messages = function (req, res) {
    res.json([]);
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
