// user route

const express = require("express");
const {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updatePassword,
	updateProfile,
	getAllUsers,
	getSingleUser,
	updateUser,
	deleteUser,
} = require("../controllers/user");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
	.route("/admin/users")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
	.route("/admin/user/:id")
	.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
	.put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
	.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
