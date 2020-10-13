var mongoose = require('mongoose')
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
	  res.status(status);
	  res.json(content);
};

/*GET a list of all blogs*/
module.exports.blogList = function(req, res) {
	console.log('Getting blog list');
	Blog
	    .find()
	    .exec(function(err, results){
		 if (!results) {
		    sendJSONresonse(res, 404, {
			"message": "no blogs found"
		    });
		    return;
		 } else if (err) {
		   console.log(err);
		   sendJSONresponse(res, 404, err);
		   return;
		 }
		 console.log(results);
		 sendJSONresponse(res, 200, buildBlogList(req, res, results));
	     });
};

var buildBlogList = function(req, res, results){
	var blogs = [];
	results.forEach(function(obj) {
	  blogs.push({
		blogTitle: obj.blogTitle,
		blogText: obj.blogText,
		createdOn: obj.createdOn,
	  	_id: obj._id
	  });
	});
	return blogs;
};


/*GET blog by id*/
module.exports.blogReadOne = function(req, res) {
     console.log('Finding blog details', req.params);
     if (req.params && rep.params.blogid) {
	Blog
	   .findById(req.params.blogid)
	   .exec(function(err, blog) {
	      if(!blog) {
		  sendJSONresponse(res, 404, {
			"message": "blogid not found"
		  });
		  return;
	      }   else if (err) {
		  sendJSONresponse(res, 404, err);
		  return;
	      }
		  sendJSONresponse(res, 200, blog);
	   });
     } else {
       sendJSONresponse(res, 404, {
	       "message": "No blogid in request"
       });
     }
};


/* POST a new blog */
module.exports.blogCreate = function(req, res) {
   console.log(req.body);
   Blog
     .create({
	 blogTitle: req.body.blogTitle,
	 blogText: req.body.blogText,
	 createdOn: req.body.createdOn
	 }, function(err, blog) {
	   if (err) {
		console.log(err);
		sendJSONresponse(res, 400, err);
	   } else {
		 console.log(blog);
		 sendJSONresponse(res, 201, blog);
	   }
	}
     );
};


/* UPDATE one blog entry */
module.exports.blogUpdateOne = function(req, res) {
   console.log("Updating a blog entry with id of " + req.params.blogid);
   console.log(req.body);
   Blog
	.findOneAndUpdate(
	    { _id: req.params.blogid },
	    { $set: {"blogTitle": req.body.blogTitle, "blogText": req.body.blogText}},
	    function(err, response) {
		if (err) {
			sendJSONresponse(res, 400, err);
		} else {
			sendJSONresponse(res, 201, respones);
		}
	    }
	);
};

/* Delete one blog */
module.exports.blogDeleteOne = function(req, res) {
	console.log("Deleting blog entry with id of " + req.params.blogid);
	console.log(req.body);
	Blog.findByIdAndRemove(req.params.blogid)
	.exec(function(err, response) {
		if (err) {
			sendJSONresponse(res, 404, err);
		} else {
			sendJSONresponse(res, 204, null);
		}
	}
	);
};
