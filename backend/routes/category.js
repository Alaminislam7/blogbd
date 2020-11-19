const express = require('express');
const router = express.Router()
const {creatCategory, getCategories, getCategory, removeCategory} = require('../controller/category');


// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controller/auth');


router.post('/category',runValidation, categoryCreateValidator, requireSignin, adminMiddleware ,creatCategory)


router.get('/categories', getCategories);
router.get('/category/:slug', getCategory);
router.delete(
  '/category/:slug',
  requireSignin,
  adminMiddleware,
  removeCategory
);

module.exports = router;
