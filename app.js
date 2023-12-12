const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const User = require('./models/user');
const path = require('path');

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

  const { username, password } = req.body;
  res.render('login');
  try {
    const user = await User.loginUser(username, password);
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

// Register route
app.get('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await User.registerUser(username, email, password);
    res.redirect('login');
  } catch (error) {
    res.render('register', { error: error.message });
  }
});

app.get('/', (req, res) => {
  if (!req.session.user) {
    res.render('index');
    return;
  }

  // Render main to-do page with user data
});

// Additional routes for to-do app functionalities

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
