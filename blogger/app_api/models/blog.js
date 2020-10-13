var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
	blogTitle: {
		type: String,
		required: true
	},
	blogText: String,
	createdOn: {
		type: String,
		"default": Date.now
	}
});

mongoose.model('Blog', blogSchema, 'blogs');
