const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;      // Port either 5000 or environment variable from heroku


// Serve static assets / react build folder if we are in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log("Server started on port", port);
});