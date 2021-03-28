/*
    NOTE:

    This file has the logic for handling all the API requests for the microcontroller (thiswebsite.com/esp/whatever)
    The functions defined here are called by the router scripts in the ../routes directory
*/

// To classify incoming images (detect a package / carton)
const { classify } = require('../ml/classifier');


// Post images from esp to report an event
const createEvent = (req, res) => {
    if (!req.busboy) throw new Error('file binary data cannot be null');
    
    let fileData = null;
    let token = null;

    req.busboy.on('file', (fieldName, file) => {
        file.on('data', (data) => {
          if (fileData === null) { fileData = data; }
          else { fileData = Buffer.concat([fileData, data]); }
        });
    });

    req.busboy.on('field', (fieldName, value) => {
        if (fieldName === 'token') { token = value; }
    });

    req.busboy.on('finish', () =>{
        if (!fileData)  throw new Error('file binary data cannot be null');
        // if (!token)     throw new Error('No security token was passed');

        classify('mobilenet/model.json', fileData, async () => {
            console.log("Finished classifying");
            // createNewEvent();
            res.send("Done");
        });
    });
}


const fetchEvents = (req, res) => {

}


module.exports = { createEvent, fetchEvents }