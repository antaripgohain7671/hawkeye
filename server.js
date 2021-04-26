const express = require('express');         // Used for routing
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

// Import the ML object classifier function
const { classify } = require('./ml/classifier');

// To create new entry in db after a new package is detected
const { Event } = require('./models/eventModel');

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


io.on('connection', (socket) => {
    console.log("Client or ESP-Cam Connected");

    // Send stream to front end, when event recieved on jpgstream_server
    socket.on('jpgstream_server', (msg) => {
        io.to('webusers').emit('jpgstream_client', msg);
    });

    // Send request to esp
    socket.on('streaming-request', (data) => {
        io.sockets.emit('streaming-request', data.request);
    })

    // 
    socket.on('motion-detection', (msg) => {    

        // Convert image from base64 string to jpeg buffer
        let pictureBase64 = msg.picture;
        let pictureBuffer = Buffer.from(pictureBase64, "base64");

        // - Run object detection / classification on it
        classify('mobilenet/model.json', pictureBuffer, async (result) => {
            try {
                console.log(result);
            }
            catch (error) { console.error(error) }
        });
    });

    // Join webuser so that stream can be viewed on multiple devices if wished
    socket.on('webuser', (msg) => {
        socket.join('webusers');
    });
});



// Connect to mongoDB cloud database
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    // When connection to db successful Start node server on port
    .then(() => {
        http.listen(process.env.PORT, () => {  console.log("Server started on port", process.env.PORT);  });
    })
    // If any err
    .catch((error) => {  console.error(error.message);  }
);

// Not sure why, but just to avoid warnings I guess
mongoose.set('useFindAndModify', false);

