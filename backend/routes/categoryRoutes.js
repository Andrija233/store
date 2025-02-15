import express from 'express';
const router = express.Router();

import {authenticate, admin} from '../middlewares/authMiddleware.js';
import {createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById} from '../controllers/categoryController.js';

router.route('/').post(authenticate, admin, createCategory);
router.route('/:categoryId').put(authenticate, admin, updateCategory);
router.route('/:categoryId').delete(authenticate, admin, deleteCategory);
router.route('/categories').get(getAllCategories);
router.route('/:categoryId').get(getCategoryById);

export default router;