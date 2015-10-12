// mongooseを使用
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect("mongodb://localhost/ganttpad");

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
