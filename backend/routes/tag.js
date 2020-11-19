const express = require('express');
const router = express.Router();

// controllers
const {
  createTag,
  getTags,
  getTag,
  removeTag
} = require('../controller/tag');

// validators
const { runValidation } = require('../validators');
const { tagCreateValidator } = require('../validators/tag');
const { requireSignin, adminMiddleware } = require('../controller/auth');


router.post(
  '/tag',
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  createTag
);
router.get('/tags', getTags);
router.get('/tag/:slug', getTag);
router.delete('/tag/:slug', requireSignin, adminMiddleware, removeTag);

module.exports = router;
