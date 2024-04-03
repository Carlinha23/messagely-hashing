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


router.get('/all', async (req, res, next) => {
  try {
    const allUsers = await User.all();
    return res.json(allUsers);
  } catch (error) {
    return next(error);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    if (!user) {
      throw new ExpressError("User not found", 404);
    }
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.get('/:username/to', async (req, res, next) => {
  try {
    const messages = await User.messagesTo(req.params.username);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

router.get('/:username/from', async (req, res, next) => {
  try {
    const messages = await User.messagesFrom(req.params.username);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});


  module.exports = router;