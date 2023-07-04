const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user_model');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/shipment_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Simulated user data
const users = [
  { id: 1, username: 'admin', password: 'admin', role: 'admin' },
  { id: 2, username: 'user', password: 'user', role: 'user' },
  { id: 3, username: 'employer', password: 'employer', role: 'employer' },
];

app.set('view engine', 'ejs');
app.use(express.static('styles')); // Serve static files from the 'styles' directory
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  // create a new user
  const user = new User({
    username,
    password,
  });

  // save the user to the database
  user
    .save()
    .then(() => {
      res.render('signup-success', { email });
    })
    .catch((error) => {
      res.render('signup', { error: 'Failed to create user' });
    });
});

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;

  // Find the user with matching credentials
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
};

// Dashboard route with role-based routing
app.get('/dashboard', authenticateUser, (req, res) => {
  const { role } = req.user;

  if (role === 'admin') {
    // Render admin dashboard
    res.render('admin-dashboard');
  } else if (role === 'user') {
    // Render user dashboard
    res.render('user-dashboard');
  } else if (role === 'employer') {
    // Render employer dashboard
    res.render('employer-dashboard');
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', authenticateUser, (req, res) => {
  const { role } = req.user;
  
  if (role === 'admin') {
    // Redirect to admin dashboard
    res.redirect('/dashboard/admin');
  } else if (role === 'user') {
    // Redirect to user dashboard
    res.redirect('/dashboard/user');
  } else if (role === 'employer') {
    // Redirect to employer dashboard
    res.redirect('/dashboard/employer');
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
});

app.get('/', (req, res) => {
  const data = {
    title: 'ERP Africa',
  };
  res.render('index', data);
});

app.listen(4013, () => {
  console.log('Server started on port 4013');
});
