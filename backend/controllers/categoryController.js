import Category from '../models/categoryModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createCategory = asyncHandler(async(req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.json({error: "Category name is required"});
        }
        const categoryExists = await Category.findOne({name});
        if(categoryExists){
            res.json({error: "Category already exists"});
        }

        const category = await Category.create({name});
        return res.status(201).json(category);
            
    } catch (error) {
        console.log(error);  
        return res.status(400).json(error); 
    }
})

const updateCategory = asyncHandler(async(req, res) => {
    try {
        const {name} = req.body;
        const {categoryId: id} = req.params;
        if(!name){
            return res.json({error: "Category name is required"});
        }
        const category = await Category.findOne({ _id: id });

        category.name = name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
            
    } catch (error) {
        console.log(error);  
        return res.status(500).json({error: error.message}); 
    }
})

const deleteCategory = asyncHandler(async(req, res) => {
    try {
        const {categoryId: id} = req.params;
        const removed = await Category.findByIdAndDelete(id);
        res.json(removed);
            
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message}); 
    }
})

const getAllCategories = asyncHandler(async(req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json(categories);
            
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message}); 
    }
})

const getCategoryById = asyncHandler(async(req, res) => {
    try {
        const {categoryId: id} = req.params;
        const category = await Category.findOne({_id: id});
        if(!category){
            return res.json({error: "Category not found"});
        }
        return res.status(200).json(category);
            
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message}); 
    }
})

export {createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById};