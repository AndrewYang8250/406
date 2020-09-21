/*GET blog list page. */
module.exports.bloglist = function(req, res) {
	res.render('bloglist', { title: 'Blog List' });
};

/*GET blog add page. */
module.exports.blogadd = function(req, res) {
	res.render('blogadd', { title: 'Blog Add' });
};
