var request = require("superagent");

var create = function(item, cb){
	request
		.post("/api")
		.type('form')
		.send(item)
		.end(cb);
}

var update = function(id, item, cb){
	request
        .put("/api/" + id)
        .type('form')
        .send(item)
        .end(cb);
}

var fetch = function(id, cb){
	request.get("/api/" + id, cb);
}

var fetchList = function(cb){
	request.get("/api", cb);
}


module.exports = {
	update : update,
	create: create,
	fetch: fetch,
	fetchList: fetchList
}