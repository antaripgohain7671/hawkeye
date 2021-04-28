import React, {useState} from 'react';
import axios from 'axios';
import Update from './Update/Update';
import './styles.css';

let allEvents = [];

async function fetchEvents (){

    await axios.get('https://hawkeye-security.herokuapp.com/events')
            .then((response) => {
                allEvents = response.data;
                console.log('fetched')
            })
            .catch((error) => {console.log(error)});
}
fetchEvents();

export default function Updates() {
    return(
        <>
            <div id="updates">
            {
                allEvents.map((event)=>(
                    <Update event={event}/>
                ))
            }
            </div>
        </>
    );
}