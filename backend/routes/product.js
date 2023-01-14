// product route

const express = require("express");
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductDetails,
	createProductReview,
	getProductReviews,
	deleteProductReview,
} = require("../controllers/product");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

router
	.route("/admin/product/new")
	.post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
	.route("/produc/admint/:id")
	.put(isAuthenticatedUser, updateProduct)
	.delete(isAuthenticatedUser, deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
	.route("/reviews")
	.get(getProductReviews)
	.delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;
