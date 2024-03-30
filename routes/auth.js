const express = require("express");
const router = new express.Router();
//const ExpressError = require("../expressError");
const db = require("../db");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
//const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
//const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

router.get('/', (req, res, next) => {
  res.send("APP IS WORKING!!!")
})



router.post('/register', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new ExpressError("Username and password required", 400);
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      // save to db
      const results = await db.query(`
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING username`,
        [username, hashedPassword]);
      return res.json(results.rows[0]);
    } catch (e) {
      if (e.code === '23505') {
        return next(new ExpressError("Username taken. Please pick another!", 400));
      }
      return next(e)
    }
  });



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */



module.exports = router;
