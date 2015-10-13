// mongooseを使用
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var mongodb_uri = process.env.MONGODB_URL ? process.env.MONGODB_URL : process.env.MONGOLAB_URI;
mongodb_uri = mongodb_uri ? mongodb_uri : "localhost";
console.log(mongodb_uri + "/ganttpad");
mongoose.connect(mongodb_uri + '/ganttpad');

var PostSchema = new mongoose.Schema({
	title: {
		type: String
	},
	contents: {
		type: String
	}
});
PostSchema.plugin(timestamps);

module.exports = mongoose.model('Post', PostSchema);
