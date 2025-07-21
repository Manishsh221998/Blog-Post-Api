const express = require('express');
const router = express.Router();
const BlogController = require('../controller/BlogController');
const AuthCheck = require('../middleware/authCheck');

router.use(AuthCheck);

router.post('/create/blog', BlogController.createBlog);
router.get('/blogs', BlogController.getAllBlogs);
router.put('/update/blog/:id', BlogController.editBlog);
router.delete('/delete/blog/:id', BlogController.deleteBlog);
router.patch('/like/blog/:id', BlogController.likeBlog);

router.get('/sorted/by-likes', BlogController.getBlogsSortedByLikes);

module.exports = router;
