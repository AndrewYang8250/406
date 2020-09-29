var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
	blogTitle: {
		type: String,
		required: true
	},
	blogText: String,
	createdOn: {
		type: Date,
		"default": Date.now
	}
});
