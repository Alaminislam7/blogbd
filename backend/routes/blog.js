const express = require('express');
const { requireSignin, adminMiddleware } = require('../controller/auth');
const router = express.Router()
const { createBlog, listRelated, getBlog, getPhoto, getBlogs, removeBlog, updateBlog, getAllBlogsCategoriesAndTags,  } = require('../controller/blog')

 
router.post('/blog', requireSignin, adminMiddleware, createBlog);
router.get('/blog/:slug', getBlog);
router.get('/blogs', getBlogs);
router.delete('/blog/:slug', requireSignin, adminMiddleware, removeBlog);
router.put('/blog/:slug', requireSignin, adminMiddleware, updateBlog);
router.get('/blog/photo/:slug', getPhoto);
router.post('/blogs-categories-tags', getAllBlogsCategoriesAndTags);
router.post('/blogs/related', listRelated);

module.exports = router


