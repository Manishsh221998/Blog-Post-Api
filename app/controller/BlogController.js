const Blog = require('../models/Blog');

class BlogController {

  // Create a new blog
  async createBlog(req, res) {
    try {
      const { title, content, categoryId, tags } = req.body;
      const authorId = req.user.userId;

      if (!title || !content || !categoryId) {
        return res.status(400).json({ error: 'Title, content, and categoryId are required.' });
      }

      const blog = await Blog.create({ title, content, categoryId, tags, authorId });
      return res.status(201).json({
        message: 'Blog created successfully.',
        data: blog
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      return res.status(500).json({ error: 'Server error while creating blog.' });
    }
  }

  // fetch all blogs 
  async getAllBlogs(req, res) {
    try {
  
      const blog = await Blog.find();
      return res.status(200).json({
        message: 'Blogs fetched successfully.',
        totalCount:blog.length,
        data: blog
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      return res.status(500).json({ error: 'Server error while creating blog.' });
    }
  }



  // Edit an existing blog
  async editBlog(req, res) {
    try {
      const blogId = req.params.id;
      const authorId = req.user.userId;

      const blog = await Blog.findOneAndUpdate(
        { _id: blogId, authorId },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found or unauthorized.' });
      }

      return res.json({
        message: 'Blog updated successfully.',
        data: blog
      });
    } catch (error) {
      console.error('Error editing blog:', error);
      return res.status(500).json({ error: 'Server error while editing blog.' });
    }
  }

  // Delete a blog
  async deleteBlog(req, res) {
    try {
      const blogId = req.params.id;
      const authorId = req.user.userId;

      const result = await Blog.deleteOne({ _id: blogId, authorId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Blog not found or unauthorized.' });
      }

      return res.json({
        message: 'Blog deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Server error while deleting blog.' });
    }
  }
  
//Like BLogs
  async likeBlog(req, res) {
    try {
      const blogId = req.params.id;

      const blog = await Blog.findByIdAndUpdate(
        blogId,
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found.' });
      }

      return res.json({
        message: 'Blog liked successfully.',
        data: blog
      });
    } catch (error) {
      console.error('Error liking blog:', error);
      return res.status(500).json({ error: 'Server error while liking blog.' });
    }
  }

  // Get all blogs sorted by number of likes
  async getBlogsSortedByLikes(req, res) {
    try {
      const blogs = await Blog.aggregate([
        { $sort: { likes: -1 } },
        {
          $project: {
            title: 1,
            content: 1,
            likes: 1,
            authorId: 1,
            categoryId: 1,
            tags: 1,
            createdAt: 1
          }
        }
      ]);

      return res.json({
        message: 'Blogs fetched and sorted by likes successfully.',
        data: blogs
      });
    } catch (error) {
      console.error('Error fetching blogs sorted by likes:', error);
      return res.status(500).json({ error: 'Server error while retrieving blogs.' });
    }
  }

}

module.exports = new BlogController();
