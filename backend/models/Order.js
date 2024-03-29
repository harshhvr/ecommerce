const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
	shippingInfo: {
		address: {
			type: String,
			required: [true, "Please enter the address"],
		},
		city: {
			type: String,
			required: [true, "Please enter the city"],
		},
		state: {
			type: String,
			required: [true, "Please enter the state"],
		},
		country: {
			type: String,
			required: [true, "Please enter the country"],
		},
		pinCode: {
			type: Number,
			required: [true, "Please enter the pinCode"],
		},
		phoneNo: {
			type: Number,
			required: [true, "Please enter the phoneNo"],
		},
	},
	orderItems: [
		{
			name: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			image: {
				type: String,
				required: true,
			},
			product: {
				type: mongoose.Schema.ObjectId,
				ref: "Product",
				required: true,
			},
		},
	],

	paymentInfo: {
		id: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
	},
	paidAt: {
		type: Date,
		required: true,
	},
	itemPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	taxPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	shippingPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	totalPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	orderStatus: {
		type: String,
		required: true,
		default: "Processing",
	},
	deliveredAt: Date,
	orderedBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
	orderedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
