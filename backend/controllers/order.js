const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Order = require("../models/Order");
const Product = require("../models/Product");
const APIFeatures = require("../utils/APIFeatures");
const ErrorHandler = require("../utils/ErrorHandler");

// Create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		orderedBy: req.user._id,
	});

	res.status(201).json({ success: true, order });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		"orderedBy",
		"name email"
	);

	if (!order)
		return next(new ErrorHandler("Order not found with this Id", 404));

	res.status(200).json({ success: true, order });
});

// Get Logged in User Orders
exports.getMyOrders = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find({ orderedBy: req.user._id });

	res.status(200).json({ success: true, orders });
});

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find();

	let totalAmount = 0;

	orders.forEach((order) => {
		totalAmount += order.totalPrice;
	});

	res.status(200).json({ success: true, orders, totalAmount });
});

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order)
		return next(new ErrorHandler("Order not found with this Id", 404));

	if (order.orderStatus === "Delivered")
		return next(
			new ErrorHandler("Your have already delivered this order", 400)
		);

	order.orderItems.forEach(async (item) => {
		await updateStock(item.product, item.quantity);
	});

	order.orderStatus = req.body.status;

	if (req.body.status === "Delivered") order.deliveredAt = Date.now();

	await order.save({ validateBeforeSave: false });

	res.status(200).json({ success: true });
});

async function updateStock(id, quantity) {
	const product = await Product.findById(id);

	product.stock -= quantity;

	await product.save({ validateBeforeSave: false });
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order)
		return next(new ErrorHandler("Order not found with this Id", 404));

	await order.remove();

	res.status(200).json({ success: true });
});
