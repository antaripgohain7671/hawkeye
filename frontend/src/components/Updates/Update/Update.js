import React from 'react';
import './styles.css';

export default function Update({event}) {
    return(
        <div className="card">
            <img id="snapshot" src={"data:image/jpg;base64," + event.image}/>
            <p id="timestamp">{event.createdAt}</p>
            <p id="detected-object">{event.detected}</p>
            <p id="prediction-percentage">{event.prediction}</p>
        </div>
    );
}