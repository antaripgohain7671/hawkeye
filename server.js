const express = require('express');         // Used for routing
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: true,
        credentials: false
    }
});
const dotenv   = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const webpush = require("web-push");

// Recieved from client
let subscription;

// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Enable cross origin resource sharing
app.use(cors());

// Import the ML object classifier function
const { classify } = require('./ml/classifier');

// To create new entry in db after a new package is detected
const { Event } = require('./models/eventModel');

// Add "/events" route, used by frontend to fetch all events
const eventRoutes = require('./routes/eventsRoutes.js');
app.use('/events', eventRoutes);

// Add "/subscribe" route, used by frontend to subscribe for push notification
// const notificationRoutes = require('./routes/notificationRoutes.js');
// app.use('/subscribe', notificationRoutes);
/* make use of the route above instead of defining it here
   this is a temp solution */
app.post('/subscribe', (req, res) => {
    subscription = req.body;
    res.status(201).json({});
})



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



// Load vapid keys from .env and setup Vapid
webpush.setVapidDetails(
    "mailto:test@test.com",
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
);

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

    // When motion detection event is reported
    socket.on('motion-detection', (msg) => {    

        // Convert image from base64 string to jpeg buffer
        let pictureBase64 = msg.picture;
        let pictureBuffer = Buffer.from(pictureBase64, "base64");

        // - Run object detection / classification on it
        classify('mobilenet/model.json', pictureBuffer, async (result) => {
            console.log(`Classified event image as: "${result.detectedObj}" with ${result.probability * 100}% probability`);
            // Create new entry in mongoDB with the classification data/
            try {
                let newEvent = new Event({
                    image: pictureBase64,
                    detected: result.detectedObj,
                    prediction: result.probability
                });

                await newEvent.save();
            }
            catch (error) { console.error(error) }
        });


        // Send push notification to user
        // Create payload
        const payload = JSON.stringify({ title: "New Event Reported" });
        if(subscription == undefined) {
            console.log("Subscription endpoint not available, can't send push notification");
        }
        else {
            // Pass object into sendNotification
            webpush
                .sendNotification(subscription, payload)
                .catch(err => console.error(err));
        }
    });

    // Join webuser so that stream can be viewed on multiple devices if wished
    socket.on('webuser', (msg) => {
        socket.join('webusers');
    });

    socket.on('disconnect', function() {
        console.log('Got disconnected!');
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

