
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.logged_in = function(req, res){
  res.json(req.user || false);
}
