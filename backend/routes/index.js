// routes/index.js
const express = require("express");
const userRoutes = require("./user.routes");
const posterRoutes = require("./poster.routes");

const router = express.Router();

console.log("here");

// Mount specific routers
router.use("/users", userRoutes);
router.use("/posters", posterRoutes);

module.exports = router;
