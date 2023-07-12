const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const user_model = require('./models/user_model');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: "keeping you logged in",
  resave: false,
  saveUninitialized: false
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shipment_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Apply passport-local-mongoose plugin to userSchema
userSchema.plugin(passportLocalMongoose);

// Define the User model
const User = mongoose.model('User', userSchema);

// Configure Passport to use the local strategy
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up route handlers

app.set('view engine', 'ejs');
app.use(express.static('styles'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/signup',
}));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    const { role } = req.user;

    if (role === 'admin') {
      res.render('admin-dashboard');
    } else if (role === 'user') {
      res.render('user-dashboard');
    } else if (role === 'client') {
      res.render('client-dashboard');
    } else {
      res.status(403).json({ success: false, message: 'Access denied' });
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/', (req, res) => {
  const data = {
    title: 'ERP Africa',
  };
  res.render('index', data);
});

// Define the order model
const orderSchema = new mongoose.Schema({
  orderId: String,
  trackingInfo: {
    status: String,
    location: String
  }
});

const Order = mongoose.model("Order", orderSchema);

app.get('/orders/:orderId/track', (req, res) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then((order) => {
      if (order) {
        res.status(200).json({ success: true, trackingInfo: order.trackingInfo });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error retrieving order tracking information' });
    });
});

app.post('/orders/:orderId/track', (req, res) => {
  const { orderId } = req.params;
  const { status, location } = req.body;

  Order.findByIdAndUpdate(
    orderId,
    { $set: { 'trackingInfo.status': status, 'trackingInfo.location': location } },
    { new: true }
  )
    .then((order) => {
      if (order) {
        res.status(200).json({ success: true, trackingInfo: order.trackingInfo });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Error updating order tracking information' });
    });
});

app.listen(4013, () => {
  console.log('Server started on port 4013');
});
