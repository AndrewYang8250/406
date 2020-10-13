/*GET home page. */
module.exports.home = function(req, res) {
	res.render('home', { title: 'Andrew Yangs Blog Site' });
};
