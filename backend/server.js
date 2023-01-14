const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log(`Shutting down the server due to Uncaught Exception.`);
});

// Config
dotenv.config({ path: "backend/config/config.env" });

const port = process.env.PORT;

// Connecting to database
connectDB();

const server = app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
  console.log(`Homepage: http://localhost:${port}`);
});

// Handling Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log(`Shutting down the server due to Unhandled Rejection.`);

  server.close(() => {
    process.exit(1);
  });
});
