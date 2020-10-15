var request = require('request');
var apiOptions = {
	server : "http://3.237.172.53:80"
};


var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Page not found.";
	} else if (status === 500) {
		title = "500, internal server error";
		content = "There is an internal server error.";
	} else {
		title = status + ", something's gone wrong";
		content = "There is something wrong.";
	}
	res.status(status);
	res.render('textPage', {
		title : title,
		content : content
	});
};


module.exports.blogAdd = function(req, res) {
  res.render('blogAdd', { title: 'Add Blog' });
};


module.exports.addBlog = function(req, res) {
	var path = '/api/blogs';

	var postdata = {
		title: req.body.title,
		text: req.body.text,
		createdOn: new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
	};

	var requestOptions = {
		url : apiOptions.server + path,
		method : "POST",
		json : postdata
	};

	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 201){
			res.redirect('/blogList');
		} else {
			_showError(req, res, response.statusCode);
		}
	}
	);
};


module.exports.blogList = function(req, res) {
	var path = '/api/blogs/';
	var requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {},
		qs : {}
	};
	
	request(requestOptions, function(err, response, body) {
		renderBlogListPage(req, res, body);
	}
	);
};

var renderBlogListPage = function(req, res, responseBody) {
  res.render('blogList', { 
	  title: 'Blog List',
	  blogs: responseBody
  });
};


module.exports.blogEdit = function(req, res) {
	var path = '/api/blogs/' + req.params.blogid;
	var requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(requestOptions, function(err, response, body) {
		renderBlogEditPage(req, res, body);
	}
	);
};

var renderBlogEditPage = function(req, res, responseBody) {
  res.render('blogEdit', { title: 'Edit Blog', blog: responseBody });
};

module.exports.editBlog = function(req, res) {
	var id = req.params.blogid;
	var path = '/api/blogs/' + id;

	var postdata = {
		title: req.body.title,
		text: req.body.text
	};

	var requestOptions = {
		url : apiOptions.server + path,
		method : "PUT",
		json : postdata
	};

	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 201) {
			res.redirect('/blogList');
		} else {
			_showError(req, res, response.statusCode);
		}
	}
	);
};


var renderBlogDeletePage = function(req, res, responseBody) {
	res.render('blogDelete', { title: 'Delete Blog', blog: responseBody });
};


module.exports.blogDelete = function(req, res) {
	var path = "/api/blogs/" + req.params.blogid;
	
	var requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};

	request(requestOptions, function(err, response, body) {
		renderBlogDeletePage(req, res, body);
	}
	);
};


module.exports.deleteBlog = function(req, res) {
	var path = "/api/blogs/" + req.params.blogid;

	requestOptions = {
		url : apiOptions.server + path,
		method : "DELETE",
		json : {}
	};

	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 204){
			res.redirect('/blogList');
		} else {
			_showError(req, res, response.statusCode);
		}
	}
	);
};
