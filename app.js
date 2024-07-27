require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// database connection handler
const connectDB = require("./db/connect");

const authenticateUser = require("./middleware/authentication");
// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routers
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// middleware
app.use(express.static("./public"));
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", authenticateUser, postRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    // establishing database connection
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
