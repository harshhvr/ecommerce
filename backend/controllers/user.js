const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
const APIFeatures = require("../utils/APIFeatures");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a User
exports.register = catchAsyncErrors(async (req, res, next) => {
	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: "This is a sample id",
			url: "avatarUrl",
		},
	});

	sendToken(user, 201, res);
});

// Login User
exports.login = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	// Checking if user has given email and password both
	if (!email || !password)
		return next(new ErrorHandler("Please enter email and password", 400));

	const user = await User.findOne({ email }).select("+password");

	if (!user) return next(new ErrorHandler("Invalid email or password!", 401));

	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched)
		return next(new ErrorHandler("Invalid email or password!", 401));

	sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, { expiresOn: new Date(Date.now), httpOnly: true });

	res.status(200).json({
		success: true,
		message: "Logged out!",
	});
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) return next(new ErrorHandler("User not found!", 404));

	// Get ResetPassword Token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	const resetPasswordUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/reset/${resetToken}`;

	const message = `Your password rest token is :- \n\n${resetPasswordUrl}\n\nIf you are not requested to this email then, please ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Ecommerce Password Recovery",
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully!`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	// Creating Token Hash
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user)
		return next(
			new ErrorHandler(
				"Reset Password Token is invalid or has been expired!",
				400
			)
		);

	if (req.body.password !== req.body.confirmPassword)
		return next(new ErrorHandler("Password doesn't match!", 400));

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});

// GET User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

	if (!isPasswordMatched)
		return next(new ErrorHandler("Old Password is incorrect!", 400));

	if (req.body.newPassword !== req.body.confirmPassword)
		return next(new ErrorHandler("Password doesn't match!", 400));

	user.password = req.body.newPassword;

	await user.save();

	sendToken(user, 200, res);
});

// Update Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	// We will add cloudinary later

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({ success: true });
});

// Get All Users -- Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({ success: true, users });
});

// Get Single User -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user)
		return next(
			new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`)
		);

	res.status(200).json({ success: true, user });
});

// Update User -- Admin
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({ success: true });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user)
		return next(
			new ErrorHandler(`User doesn't exists with Id: ${req.params.id}`)
		);

	// We will remove cloudinary later

	await user.remove();

	res.status(200).json({ success: true, message: "User deleted successfully" });
});