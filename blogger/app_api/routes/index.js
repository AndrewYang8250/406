var express = require('express');
var router = express.Router();

var ctrlBlog = require('../controllers/blog');

router.get('/blogs', ctrlBlog.blogList);
router.post('/blogs', ctrlBlog.blogCreate);
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
router.put('/blogs/:blogid', ctrlBlog.blogUpdateOne);
router.delete('/blogs/:blogid', ctrlBlog.blogDeleteOne);

module.exports = router;

