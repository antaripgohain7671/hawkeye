import React from 'react';
import './styles.css';

export default function Update({event}) {

    return(
        <div className="card">
            <img
                id="snapshot"
                src={"data:image/jpg;base64," + event.image}
            />
            
            <h3
                id="detected-object">
                <span className="context"> Object classified as: </span>
                <span className="info"> {event.detected} </span>
            </h3>

            <p
                id="prediction-percentage">
                Prediction confidence:
                {parseFloat(event.prediction).toFixed(2)}
            </p>

            <p
                id="timestamp">
                {event.createdAt}
            </p>
        </div>
    );
}