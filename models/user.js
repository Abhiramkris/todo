const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  // Your MySQL database connection details
  host:"localhost",
  user:"root",
  password:"",
  database:"todo",
});

async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query('INSERT INTO users SET ?', {
    username,
    email,
    password: hashedPassword,
  });

  return result.insertId;
}

async function loginUser(username, password) {
  const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if (!user) {
    throw new Error('Username not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
};
