import React, {useState} from 'react';
import axios from 'axios';
import Update from './Update/Update';
import './styles.css';

export default function Updates() {

    // const [updates, setEventsDetails] = useState();

    // const fetchEvents = async () => {
    //     let events;
    //     await axios.get('http://localhost:3000/events')
    //         .then((response) => {
    //             events = response.data;
                
    //         })
    //         .catch((error) => {console.log(error)});
    // }

    return(
        <div>
            {/* <button onClick={fetchEvents}>Get Events</button> */}
            {/* {
                updates.map((update) => (
                    <Update update={update}/>
                ))
            } */}
        </div>
    );
}