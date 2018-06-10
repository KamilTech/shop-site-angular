const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const router = express.Router(); // Creates a new router object.
const app = express(); // Initiate Express Application
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('./config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const authentication = require('./routes/authentication')(router); // Import Authentication Routes
const blogs = require('./routes/blogs')(router); // Import Blog Routes
const shop = require('./routes/shop')(router); // Import Shop Routes
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors');

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist/client/'));
app.use('/authentication', authentication); // Use authentication routes in application
app.use('/blogs', blogs); // Use Blog routes in application
app.use('/shop', shop); // Use Shop routes in application

// Connect server to Angular 4 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});