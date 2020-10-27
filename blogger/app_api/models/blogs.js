var mongoose = require( 'mongoose' );

var getNewDate = function() { return new Date(); };

var blogSchema = new mongoose.Schema({
		title: {
					type: String,
					required: true
				},
		text: {
					type: String,
					required: true
				},
		createdOn: {
					type: String,
					"default": getNewDate().toLocaleString("en-US", {timeZone: "America/New_York"})
				}
});

mongoose.model('Blog', blogSchema);
