/*GET blog list page. */
module.exports.bloglist = function(req, res) {
	res.render('bloglist', {
		title: 'Blog List',
		blogs: [{
			blogTitle: 'Blog 1',
			blogText: 'My first blog entry.'
	     	      }, {
			blogTitle: 'Blog 2',
			blogText: 'What is the meaning of life.'
	     	      }, {
			blogTitle: 'Blog 3',
			blogText: 'I blog, therefore I am!'
	     	      }]
		});
};	
/*GET blog add page. */
module.exports.blogadd = function(req, res) {
	res.render('blogadd', { title: 'Blog Add' });
};

module.exports.blogdelete = function(req, res) {
	res.render('blogdelete', { title: 'Blog Delete' });
};

module.exports.blogedit = function(req, res) {
	res.render('blogedit', { title: 'Blog edit' });
};
