var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

router.get('/', ctrlHome.index);
router.get('/blogList', ctrlBlog.blogList);
router.get('/blogAdd', ctrlBlog.blogAdd);
router.get('/blogEdit/:blogid', ctrlBlog.blogEdit);
router.get('/blogDelete/:blogid', ctrlBlog.blogDelete);


router.post('/blogEdit/:blogid', ctrlBlog.editBlog);
router.post('/blogAdd', ctrlBlog.addBlog);
router.post('/blogDelete/:blogid', ctrlBlog.deleteBlog);

module.exports = router;
