import React from 'react';
import styles from './About.module.css';

export default function About() {

    return (
        <div className={styles.about}>
            <h1>HAWK EYE EXTERNAL HOME SECURITY</h1>
            <h3>Final year project by IoT Group 6 - Jain University (BCA), AY 2018-2021 </h3>
            <p>This webapp is part of the final semester project done by: </p>
            <ul>
                <li>Basanta Goswami</li>
                <li>Antarip Gohain</li>
                <li>Prapulla M</li>
                <li>Abhishek Sharma</li>
            </ul>
        </div>
    )
}
