var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONResponse = function(res, status, content) {
		res.status(status);
		res.json(content);
};

var buildBlogList = function(req, res, results){
	var blogs = [];
	results.forEach(function(obj){
		blogs.push({
			title: obj.title,
			text: obj.text,
			createdOn: obj.createdOn,
			author: obj.author,
			authorEmail: obj.authorEmail,
			comments: obj.comments,
			_id: obj._id
		});
	});
	return blogs;
};

module.exports.blogCreate = function (req, res) {
	console.log(req.body);
	Blog.create({
		title: req.body.title,
		text: req.body.text,
		createdOn: req.body.createdOn,
		author: req.body.author,
		authorEmail: req.body.authorEmail
	}, function(err, blog) {
		if(err) {
			console.log(err);
			sendJSONResponse(res, 400, err);
		} else {
			console.log(blog);
			sendJSONResponse(res, 201, blog);
		}
	}
      );
};

module.exports.blogReadOne = function (req, res) {
	console.log('Finding blog id details', req.params);
	if(req.params && req.params.blogid) {
		Blog.findById(req.params.blogid)
		.exec(function(err, blog) {
			if(!blog) {
				sendJSONResponse(res, 404, {
					"message": "blogid not found"
				});
				return;
			} else if (err) {
				sendJSONResponse(res, 404, err);
				return;
			}
			sendJSONResponse(res, 200, blog);
		});
	} else {
		sendJSONResponse(res, 404, {
			"message": "No blogid in request"
		});
	}
};

module.exports.blogList = function (req, res) {
	console.log('Getting list of blogs.');
	Blog.find().exec(function(err, results) {
		if(!results) {
			sendJSONResponse(res, 404, {
				"message": "no blogs found"
			});
			return;
		} else if (err) {
			console.log(err);
			sendJSONResponse(res, 404, error);
			return;
		}
		console.log(results);
		sendJSONResponse(res, 200, buildBlogList(req, res, results));
	});
};

module.exports.blogUpdateOne = function (req, res) {
	console.log("Updating a blog entry with id of " + req.params.blogid);
	console.log(req.body);
	Blog.findOneAndUpdate({ _id: req.params.blogid },
		{ $set: {"title": req.body.title, "text": req.body.text }},
		function(err, response) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, response);
			}
		}
	);
};

module.exports.blogDeleteOne = function (req, res) {
	console.log("Deleting blog entry with id of " + req.params.blogid);
	console.log(req.body);
	Blog.findByIdAndRemove(req.params.blogid)
	.exec(function(err, response) {
		if (err) {
			sendJSONResponse(res, 404, err);
		} else {
			sendJSONResponse(res, 204, null);
		}
	}
	);
};

module.exports.addComment = function (req, res) {
	console.log("Commenting on blog with id " + req.params.blogid);
	console.log(req.body);
	Blog.findOneAndUpdate({ _id: req.params.blogid },
		{ $set: { "comments" : req.body.comments }},
		function(err, response) {
			if (err) {
				sendJSONResponse(res, 400, err);
			} else {
				sendJSONResponse(res, 201, response);
			}
		}
	);
};
