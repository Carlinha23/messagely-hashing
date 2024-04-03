/** User class for message.ly */

const db = require('../db');


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({username, password, first_name, last_name, phone, join_at, last_login_at}) {
    const result = await db.query(`
      INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING username, password, first_name, last_name, phone, join_at, last_login_at
    `, [username, password, first_name, last_name, phone, join_at, last_login_at]);

    return result.rows[0];
  }


  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const result = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE username = $1 AND password = $2
    `, [username, password]);

    return result.rows[0].count === '1';
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    await db.query(`
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE username = $1
    `, [username]);
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    try {
      const result = await db.query(`
        SELECT username, first_name, last_name, phone FROM users
      `);
    
      return result.rows;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }
  
    

  static async get(username) { 
    try {
      const result = await db.query(`
        SELECT username, first_name, last_name, phone
        FROM users
        WHERE username = $1
      `, [username]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error retrieving user: ${error.message}`);
    }
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id,
              m.to_username,
              u.first_name,
              u.last_name,
              u.phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
          JOIN users AS u ON m.to_username = u.username
        WHERE from_username = $1`,
      [username]);

  return result.rows.map(m => ({
    id: m.id,
    to_user: {
      username: m.to_username,
      first_name: m.first_name,
      last_name: m.last_name,
      phone: m.phone
    },
    body: m.body,
    sent_at: m.sent_at,
    read_at: m.read_at
  }));
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    const result = await db.query(
      `SELECT m.id,
              m.from_username,
              u.first_name,
              u.last_name,
              u.phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
         JOIN users AS u ON m.from_username = u.username
        WHERE to_username = $1`,
      [username]);

  return result.rows.map(m => ({
    id: m.id,
    from_user: {
      username: m.from_username,
      first_name: m.first_name,
      last_name: m.last_name,
      phone: m.phone,
    },
    body: m.body,
    sent_at: m.sent_at,
    read_at: m.read_at
  }));
  }
}


module.exports = User;