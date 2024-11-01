require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

// middleware
app.use(cookieParser());
app.use(express.static("./public"));
app.use(express.json());
// cors middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// app.use(express.urlencoded({ extended: true }));

// database connection handler
const connectDB = require("./db/connect");

// authentication middlewares
const authenticateUser = require("./middleware/authentication");
const authenticateAdmin = require("./middleware/admin-auth");

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routers
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const feedRoute = require("./routes/feed");
const unprotectedPostRoute = require("./routes/UnprotectedPostRoutes");
const reportRoute = require("./routes/report");

//protected routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", authenticateUser, postRoute);
app.use("/api/v1/user", authenticateUser, userRoute);
app.use("/api/v1/auth/admin", adminRoute);
app.use("/api/v1/admin", authenticateAdmin, adminRoute);
app.use("/api/v1/feed", authenticateUser, feedRoute);
app.use("/api/v1/report", authenticateUser, reportRoute);

// unprotected routes
app.use("/api/v1/post", unprotectedPostRoute);

// error handler middleware
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
