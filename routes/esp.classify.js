const express =  require('express');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

const ml = require('../ml/classifier'); // Our custom module
let img = 'ml/images/file.jpg';

const router = express.Router();

router.post('/classify', (req, res) => {
    let busboy = new Busboy({
        headers: req.headers
    });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

        let saveTo = path.join(__dirname, '../ml/images/file.jpg');
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function () {
        res.writeHead(200, {
            'Connection': 'close'
        });
        res.end("Image recieved");

        // Classify image
        ml.classify('mobilenet/model.json', img, (result) => {
            console.log("Finished classifying");
        });
    });

    return req.pipe(busboy);
});

module.exports = router;