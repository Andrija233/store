import express from 'express';
import formidable from 'express-formidable';
import { authenticate, admin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';

// controllers
import { addProduct, updateProduct, deleteProduct, getProducts, getProductById, getAllProducts, addProductReview, getTopProducts, getNewProducts } from '../controllers/productController.js';

const router = express.Router();

router.route('/')
    .post(authenticate, admin, formidable(), addProduct)
    .get(getProducts);

router.route('/allproducts').get(getAllProducts);
router.route('/:id/reviews').post(authenticate, checkId, addProductReview)


router.get('/top', getTopProducts);
router.get('/new', getNewProducts);
router.route('/:id')
    .get(getProductById)
    .put(authenticate, admin, formidable(), updateProduct)
    .delete(authenticate, admin, deleteProduct);


export default router;