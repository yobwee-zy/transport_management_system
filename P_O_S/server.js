const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shipmentRoutes = require('./models/shipment_routes');
const User = require('./models/user_model');


const app = express();
app.use(express.json());

// Connect to MongoDB
//const url = "mongodb://localhost:27017/People"
//mongoose.connect(url, {})
 //.then(result => console.log("database connected"))
 //.catch(err => console.log(err))

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

// Routes
app.use('/shipments', shipmentRoutes);

app.set('view engine', 'ejs');
app.use(express.static('styles')); // Serve static files from the 'styles' directory
app.use(bodyParser.urlencoded({extended: true }));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  //create a new user
  const user = new User({
    username,
    password,
  });

//save the user to database
user.save()
  .then(() => {
    res.render('signup-success', { username });
  })
  .catch((error) => {
    res.render('signup', { error: 'Failed to create user' });
  });
});

app.get('/dashboard', (req, res) => {
  // Prepare data for components
  const overviewData = {/* ... */};
  const statisticsData = {
    title: 'Statistics',
    items: [
      { name: 'Vehicles', value: 'Logistics' },
      { name: 'Fuel', value: 'Price' },
      // Add more items as needed
    ]
  };
  const reportsData = {fuel: {
    1: 50,
    2: 60,
    3: 70,
    4: 15,
    5: 25,
    6: 23
  },
  repairs: {
    1: 3,
    2: 5,
    3: 8,
    4: 4,
    5: 6,
    6: 0
  },
  trips: {
    1: 10,
    2: 15,
    3: 13,
    4: 16,
    5: 12,
    6: 19
  },
  revenue: {
    1: 1000,
    2: 1500,
    3: 1300,
    4: 1600,
    5: 1200,
    6: 1900
  }
};

  res.render('dashboard', {
    overview: overviewData,
    statistics: statisticsData,
    reports: reportsData
    
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  //Find user in the database
  User.findOne({ username })
    .then((user) => {
      if (user && user.password === password) {
        res.redirect('/dashboard');
      } else {
        res.render('login', { error: 'Invalid username or password' });
      }
    })
    .catch((error) => {
      res.render('login', { error: 'Failed to authenticate user' });
    });
  });

app.get('/', (req, res) => {
  const data = {
    title: 'ERP Africa'
  };
  res.render('index', data);
});

app.listen(4013, () => {
  console.log('Server started on port 4013');
});
