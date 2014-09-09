/*
 * GET users in room
 * GET last 10 messages in room
 */

var waiting_list = {};

var slow_waiting_list = [];

exports.new_message = function (req, res) {
    res.json(JSON.parse(req.body));

};

exports.last_messages = function (req, res) {
    
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
