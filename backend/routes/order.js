// order route

const express = require("express");
const {
	newOrder,
	getSingleOrder,
	getMyOrders,
	getAllOrders,
	updateOrder,
	deleteOrder,
} = require("../controllers/order");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router
	.route("/order/:id")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, getMyOrders);

router
	.route("/admin/orders")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
	.route("/admin/order/:id")
	.put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
	.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)

module.exports = router;
