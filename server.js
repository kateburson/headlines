// Require dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const router = require('./routes/routes.js');

// Initialize Express
const app = express();

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headlines";
mongoose.connect(MONGODB_URI);

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register Handlebars view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// Use Handlebars view engine
app.set('view engine', 'handlebars');

// apply the routes to our application
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Headlines app is running → PORT 3000');
});