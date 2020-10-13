var request = require('request');
var serverOption = {
		server : "http://3.237.172.53:80"
};

/* function for displaying errors */
var errorMessage = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Page not found.";
	} else if (status === 500) {
		title = "500, internal server error";
		content = "There is a problem with our server.";
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

/* Add a blog (POST) */
module.exports.addBlog = function(req, res) {
	var path = '/api/blogs';
	var postdata = {
		blogTitle: req.body.blogTitle,
		blogText: req.body.blogText,
		createdOn: new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
	};
	var requestOptions = {
		url : serverOption.server + path,
		method : "POST",
		json : postdata
	};
	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 201){
			res.redirect('/blogList');
		} else {
			errorMessage(req, res, response.statusCode);
		}
	}
	);
};


module.exports.blogList = function(req, res) {
	var path = '/api/blogs/';
	var requestOptions = {
		url : serverOption.server + path,
		method : "GET",
		json : {},
		qs : {}
	};
	request(requestOptions, function(err, response, body) {
		renderBlogListPage(req, res, body);
	}
	);
};

/* Render Blog List page */
var renderBlogListPage = function(req, res, responseBody) {
	res.render('blogList', { 
		title: 'Blog List',
		blogs: responseBody
	});
};





module.exports.blogEdit = function(req, res) {
	var path = '/api/blogs/' + req.params.blogid;
	var requestOptions = {
		url : serverOption.server + path,
		method : "GET",
		json : {}
	};
	request(requestOptions, function(err, response, body) {
		renderBlogEditPage(req, res, body);
	}
	);
};

/* Render Blog Edit page */
var renderBlogEditPage = function(req, res, responseBody) {
	res.render('blogEdit', { title: 'Edit Blog', blog: responseBody });
};


module.exports.editBlog = function(req, res) {
	var id = req.params.blogid;
	var path = '/api/blogs/' + id;
	var postdata = {
		blogTitle: req.body.blogTitle,
		blogText: req.body.blogText
	};
	var requestOptions = {
		url : serverOption.server + path,
		method : "PUT",
		json : postdata
	};
	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 201) {
			res.redirect('/blogList');
		} else {
			errorMessage(req, res, response.statusCode);
		}
	}
	);
}


var renderBlogDeletePage = function(req, res, responseBody) {
	res.render('blogDelete', { title: 'Delete Blog', blog: responseBody });
};


/* GET Blog Delete page */
module.exports.blogDelete = function(req, res) {
	var path = "/api/blogs/" + req.params.blogid;
	var requestOptions = {
		url : serverOption.server + path,
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
		url : serverOption.server + path,
		method : "DELETE",
		json : {}
	};
	request(requestOptions, function(err, response, body) {
		if(response.statusCode === 204){
			res.redirect('/blogList');
		} else {
			errorMessage(req, res, response.statusCode);
		}
	}
	);
};












