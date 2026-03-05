const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createCategory = catchAsync(async (req, res) => {
    const category = await Category.create(req.body);
    return sendSuccess(res, 201, 'Category created.', { category });
});

const getAllCategories = catchAsync(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    return sendSuccess(res, 200, 'Categories fetched.', { categories });
});

const updateCategory = catchAsync(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return sendError(res, 404, 'Category not found.');
    return sendSuccess(res, 200, 'Category updated.', { category });
});

const deleteCategory = catchAsync(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return sendError(res, 404, 'Category not found.');
    return sendSuccess(res, 200, 'Category deleted.');
});

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };
