// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const items = require('./routes/items');
const auth = require('./routes/auth');
const keys = require('./config/keys');
const authMiddleware = require('./middleware/auth');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/items', items);
app.use('/auth', auth);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware to handle INVENTORY MANAGER or INVENTORY VISITOR view
app.use((req, res, next) => {
  if (req.user) {
    res.locals.viewHeader = 'INVENTORY MANAGER VIEW';
  } else {
    res.locals.viewHeader = 'INVENTORY VISITOR VIEW';
  }
  next();
});

// Home button middleware
app.use((req, res, next) => {
  res.locals.homeButton = '<a href="/" class="home-btn">Home</a>';
  next();
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
