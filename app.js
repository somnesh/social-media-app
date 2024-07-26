require("dotenv").config();
require("express-async-errors");

const connectDB = require("./db/connect");

const express = require("express");
const app = express();

// routes

// middleware
app.use(express.static("./public"));
app.use(express.json());

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    // connect DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
