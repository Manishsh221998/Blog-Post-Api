const Category = require('../models/Category');
const Blog = require('../models/Blog');

class CategoryController {

  // Add a new category
  async addCategory(req, res) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: 'Both category name and description are required.',
        });
      }

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: `Category already exists.`,
        });
      }

      const category = await Category.create({ name, description });
      res.status(201).json({
        success: true,
        message: 'Category added successfully.',
        data: category,
      });
    } catch (error) {
      console.error('Add Category Error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while adding the category. Please try again later.',
        error: error.message,
      });
    }
  }

  async listCategories(req, res) {
    try {
      const categories = await Category.aggregate([{
        $project: {
          name: 1,
          description: 1,
        },
      }]);
      res.status(200).json({
        success: true,
        message: 'Categories fetched successfully.',
        totalCategories: categories.length,
        data: categories,
      });
    } catch (error) {
      console.error('List Categories Error:', error);
      res.status(500).json({
        success: false,
         error: error.message,
      });
    }
  }

  // List categories with blog posts and post count
  async listCategoriesWithPosts(req, res) {
    try {
      const categories = await Category.aggregate([
        {
          $lookup: {
            from: 'blogs',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'posts',
          },
        },
        {
          $addFields: {
            postCount: { $size: '$posts' },
          },
        },
        {
          $sort: { postCount: -1 },
        },
        {
          $project: {
            name: 1,
            postCount: 1,
            description: 1,
            posts: {
              _id:1,
              title: 1,
              summary: 1,
              authorId: 1,
              createdAt: 1,
            },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: 'Categories with posts retrieved successfully.',
        totalCategories: categories.length,
        data: categories,
      });
    } catch (error) {
      console.error('List Categories Error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving categories.',
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryController();

