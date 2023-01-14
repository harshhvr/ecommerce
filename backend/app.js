const express = require("express");
const cookieParser = require("cookie-parser");

// Create an express app
const app = express();

const errorMiddleware = require("./middlewares/error");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to serve static files on the server
// app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

// Import routes
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

app.use(errorMiddleware);

module.exports = app;
