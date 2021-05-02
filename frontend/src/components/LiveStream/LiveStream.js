import React from 'react';
import io from 'socket.io-client';
import './styles.css';

const socket = io("");

export default function LiveStream() {
    let isLiveStreaming = false;

    // When images are recieved as base64 strings, set source to that string
    socket.on('jpgstream_client', function (msg) {
        if(isLiveStreaming)
            document.querySelector('#jpgstream').src = "data:image/jpg;base64," + msg.picture;
    });

    if(isLiveStreaming) {
    }
    else {

    }

    // Send signal to node, which is then forwarded to espcam to
    // change mode of operation between livestreaming and motion detecting
    const eventHandler = () => {
        socket.emit('streaming-request', {});
        isLiveStreaming = !isLiveStreaming;

        if(!isLiveStreaming) {
            document.querySelector('#jpgstream').src = "/images/playbutton.png";
        }
    }

    // Establish yourself as a webuser
    socket.emit("webuser", {});

    return (
        <div id="jpgwrapper">
            <center><h1>LIVE FEED FROM ESPCAM</h1></center>
            <img
                id="jpgstream"
                className="jpgstream"
                src="/images/playbutton.png"
                alt="Livestream from ESP32-CAM"
                onClick={eventHandler}
            />
        </div>
    );
}