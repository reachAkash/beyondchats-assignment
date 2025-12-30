const express = require("express");
const articleRoutes = require("./routes/article.routes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/error.middleware");
const logger = require("./middlewares/logger.middleware");
const cors = require("cors");

const app = express();

// logger middleware
app.use(logger);
// CORS middleware
app.use(cors());
// Body parser
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
