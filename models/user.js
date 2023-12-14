const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();
const notifier = require('node-notifier');
const pool = mysql.createPool({
  // Your MySQL database connection details
  host:"localhost",
  user:"root",
  password:"",
  database:"todo",
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


async function CheckSql()
{
  pool.getConnection((err, connection) => {
    if (err) {
      //res.status(500).send('Error connecting to MySQL server');
      console.error(err);
      notifier.notify({
        title: 'Salutations!',
        message: 'Hey there!',
       // icon: path.join(__dirname, 'icon.jpg'),
        sound: true,
        wait: true
      })
    } else {
     // res.send('MySQL connection is healthy!');
      connection.release();
    }
  });
}
async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    username: username,
    email: email,
    password: hashedPassword, // You should hash the password before inserting into the database
  };

  pool.query('INSERT INTO users SET ?', userData, (error, resultss) => {
    if (error) {
      console.error('Error inserting into the database:', error);
    } else {
      console.log('User inserted successfully!');
      console.log('Inserted row ID:', results.insertId);
    }
  });
  
  return result.insertId;
}

async function loginUser(username, password) {
  const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  //console.log(username);
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
  CheckSql,
};
