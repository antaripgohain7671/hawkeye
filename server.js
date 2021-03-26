const express = require('express');         // Used for routing
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;      // Port either 5000 or environment variable from heroku


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

// Start node server on PORT
app.listen(port, () => {
    console.log("Server started on port", port);
});