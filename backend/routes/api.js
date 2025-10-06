const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');


// Basic endpoints
router.get('/users', async (req, res) => {
const users = await User.find().sort({ createdAt: -1 });
res.json(users);
});


router.get('/products', async (req, res) => {
const products = await Product.find();
res.json(products);
});


router.get('/orders/recent', async (req, res) => {
const orders = await Order.find().populate('userId').populate('items.productId').sort({ createdAt: -1 }).limit(20);
res.json(orders);
});


// Dashboard stats: sales by day
router.get('/stats/sales-by-day', async (req, res) => {
const result = await Order.aggregate([
{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalSales: { $sum: "$total" }, orders: { $sum: 1 } } },
{ $sort: { _id: 1 } }
]);
res.json(result);
});


// Top products by quantity sold
router.get('/stats/top-products', async (req, res) => {
const result = await Order.aggregate([
{ $unwind: '$items' },
{ $group: { _id: '$items.productId', qtySold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
{ $sort: { qtySold: -1 } },
{ $limit: 10 },
{ $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
{ $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
]);
res.json(result);
});


module.exports = router;