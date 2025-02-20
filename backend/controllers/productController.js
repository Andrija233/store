import asyncHandler from '../middlewares/asyncHandler.js';
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, category, brand, price, quantity, description,} = req.fields;
        
        // validation
        switch(true){
            case !name:
                return res.json({error: "Name is required"});
            case !category:
                return res.json({error: "Category is required"});
            case !brand:
                return res.json({error: "Brand is required"});
            case !price:
                return res.json({error: "Price is required"});
            case !quantity:
                return res.json({error: "Quantity is required"});
            case !description:
                return res.json({error: "Description is required"});
        }

        // create new product 
        const product = new Product({...req.fields});
        await product.save();
        return res.status(201).json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, brand, price, quantity, description,} = req.fields;
        
        // validation
        switch(true){
            case !name:
                return res.json({error: "Name is required"});
            case !category:
                return res.json({error: "Category is required"});
            case !brand:
                return res.json({error: "Brand is required"});
            case !price:
                return res.json({error: "Price is required"});
            case !quantity:
                return res.json({error: "Quantity is required"});
            case !description:
                return res.json({error: "Description is required"});
        }

        // update product 
        const product = await Product.findByIdAndUpdate(id, {...req.fields}, {new: true});
        await product.save();
        return res.status(201).json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        return res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const getProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: "i"
            }
        } : {};

        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword}).limit(pageSize);
        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

const getProductById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if(product){
            return res.json(product);
        }else {
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json(error.message);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).populate("category").limit(12).sort({createdAt: -1});
        res.json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const product = await Product.findById(id);
        if(product){
            const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
            if(alreadyReviewed){
                res.status(400);
                throw new Error("Product already reviewed");
            }
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id
            }
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
            await product.save();
            res.status(201).json({message: "Review added"});
        }else {
            res.status(404);
            throw new Error("Product not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const getTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({rating: -1}).limit(4);
        res.json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

const getNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({createdAt: -1}).limit(5);
        res.json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const {checked, radio} = req.body;
        let filter = {};
        if(checked.length > 0){
            filter.category = checked;
        }
        if(radio.length){
            filter.price = {
                $gte: radio[0],
                $lte: radio[1]
            }
        }
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

export { addProduct, updateProduct, deleteProduct, getProducts, getProductById, getAllProducts, addProductReview, getTopProducts, getNewProducts, filterProducts };