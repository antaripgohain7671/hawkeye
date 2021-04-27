import React from 'react';
import './styles.css';

export default function Update({ update }) {
    
    return(
        <div>
            <image id="snapshot" src={update.image}/>
            <p id="timestamp">{update.createdAt}</p>
            <p id="detected-object">{update.detected}</p>
            <p id="prediction-percentage">{update.prediction}</p>
        </div>
    );
}