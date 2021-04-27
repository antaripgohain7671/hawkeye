import React from 'react';
import './styles.css';

export default function Update({ update }) {
    
    return(
        <div>
            <image id="snapshot" src={update.image}/>
            <p id="timestamp"></p>
            <p id="detected-object"></p>
            <p id="prediction-percentage"></p>
        </div>
    );
}