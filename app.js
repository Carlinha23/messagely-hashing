const express = require("express");
const app = express();

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const ExpressError = require("./expressError");


app.use(express.json());

app.use('/users', usersRoutes);
app.use(usersRoutes);

app.use('/auth', authRoutes);
// app.use(authRoutes);
/** 404 catch --- passes to next handler. */

app.use(function (req, res, next) {
  const err = new ExpressError("Not found!", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});
  


module.exports = app;