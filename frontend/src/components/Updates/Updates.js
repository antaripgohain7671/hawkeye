import React, {useState} from 'react';
import axios from 'axios';
import Update from './Update/Update';
import './styles.css';

export default function Updates() {

    let allEvents = []

    const fetchEvents = async () => {
        await axios.get('https://hawkeye-security.herokuapp.com/events')
            .then((response) => {
                allEvents = response.data;
                console.log(allEvents);
            })
            .catch((error) => {console.log(error)});
    }

    return(
        <div>
            <button onClick={fetchEvents}> Fetch Update </button>
            {
                allEvents.map((fetch)=>(
                    <Update update={{fetch}}/>
                ))

                // for(let i = 0; i < allEvents.length; i++) {
                //     <Update
                // }
            }
        </div>
    );
}