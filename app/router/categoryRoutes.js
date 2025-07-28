const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/CategoryController');

router.post('/create/category', CategoryController.addCategory);
router.get('/category-list', CategoryController.listCategories);
router.get('/category-list-with-post', CategoryController.listCategoriesWithPosts);

module.exports = router;
