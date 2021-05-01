import React from 'react';
import styles from './Header.module.css'

export default function Header({isLoggedIn}) {
    console.log("is logged in: " + isLoggedIn);
    return(
        <div id={styles.navbar}>
            
            <div className={styles.left}>
                <img className={styles.logo} src="/images/logos/logo-transparent.png"></img>
                <h1 className={styles.home}> Hawk Eye </h1>
            </div>

            <div className={styles.right}>
            { isLoggedIn && // If logged in
                <>
                    <a className={styles.rightElement} href="/"> About </a>
                    <a className={styles.rightElement} href="/"> Livestream </a>
                    <a className={styles.rightElement} href="/"> Updates </a>
                </>
            }
            { !isLoggedIn && // If not logged in 
                <>
                    <a href="/"> About </a>
                </>
            }
            </div>
        </div>
    )
}