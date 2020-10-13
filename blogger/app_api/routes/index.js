var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

/* Setup blog functions. */
/* get list of blogs */
router.get('/blogs', ctrlBlog.blogList);
/* get one blog */
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
/* add blog */
router.post('/blogs', ctrlBlog.blogCreate);
/* update blog */
router.put('/blogs/:blogid', ctrlBlog.blogUpdateOne);
/* delete blog */
router.delete('/blogs/:blogid', ctrlBlog.blogDeleteOne);

module.exports = router;
