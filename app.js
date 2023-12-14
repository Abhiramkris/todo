const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const User = require('./models/user');
const path = require('path');
const mysql = require('mysql2');
const notifier = require('node-notifier');
const pool = mysql.createPool({
  // Your MySQL database connection details
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secretislongstringforgodsake',
  resave: false,
  saveUninitialized: true,
}));
const staticPath = path.join(__dirname, 'public');
app.set('views', path.join(__dirname, 'views'));

// Use the express.static middleware to serve static files
app.use(express.static(staticPath));
// Login route
app.get('/login', async (req, res) => {

  res.render('login');
});

app.get('/register', async (req, res) => {

  res.render('register');
});

app.post('/login', async (req, res) => {

  const { username, password } = req.body;
  try {
    // console.log(req.body.username);
    const user = await User.loginUser(username, password);
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    const error1 = 'Invalid username or password';
    res.render('login', { error1 });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await User.CheckSql();
    await User.registerUser(username, email, password);
    //res.render('login');
  } catch (error) {
    console.log(error.code);
    
    if((error.code === 'ER_DUP_ENTRY'))
    {
      res.render('register', { error: error.code });
    }
    else
    res.redirect('login');
    }
});

app.get('/', (req, res) => {
  User.CheckSql();
  if (!req.session.user) {
    res.render('login');
    return;
  }

  // Render main to-do page with user data
});

app.get('/check', (req, res) => {
 User.CheckSql();
// pool.getConnection((err, connection) => {
//   if (err) {
//     //res.status(500).send('Error connecting to MySQL server');
//     console.error(err);
//     notifier.notify({
//       title: 'Salutations!',
//       message: 'Hey there!',
//      // icon: path.join(__dirname, 'icon.jpg'),
//       sound: true,
//       wait: true
//     })
//   } else {
//    // res.send('MySQL connection is healthy!');
//     connection.release();
//   }
// });
})

// Additional routes for to-do app functionalities

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
