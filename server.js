const express = require('express');         // Used for routing
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;      // Port either 5000 or environment variable from heroku
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

// Add /esp/ routes
const espRoutes = require('./routes/espRoutes.js');
app.use('/esp', espRoutes);

// Serve static assets / react build folder if we are in production, works when deployed to heroku
// In local server, need to start the react app manually
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));
    // Serve the index file for any get request
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}


// Load variables from the .env file
dotenv.config();

// Connect to mongoDB cloud database
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    // When connection to db successful Start node server on port
    .then(() => {
        app.listen(port, () => {  console.log("Server started on port", port);  });
    })
    // If any err
    .catch((error) => {  console.error(error.message);  }
);

// Not sure why, but just to avoid warnings I guess
mongoose.set('useFindAndModify', false);

