/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../expressError');
const User = require('../models/user');
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

//const usersRoutes = require('./routes/users');
//app.use('/users', usersRoutes);

router.get('/', (req, res, next) => {
    res.send("APP IS WORKING!!!")
  })

// Assuming the User.register() method is already implemented to insert a new user into the database

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError("All fields are required", 400);
    }
    // Assuming join_at and last_login_at are automatically set in the database
    const newUser = await User.register({ username, password, first_name, last_name, phone });
    return res.json(newUser); // Return the newly registered user
  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e); // Pass the error to the error handling middleware
  }
});



router.get('/all', async (req, res, next) => {
  try {
    const allUsers = await User.all();
    return res.json(allUsers);
  } catch (error) {
    return next(error);
  }
});

  module.exports = router;