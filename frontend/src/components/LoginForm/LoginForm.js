import React, {useState} from 'react';
import styles from './Loginform.module.css'

export default function LoginForm({Login, error}) {
    const [details,setDetails] = useState({email:"",password:""});

    const submitHandler = e =>{
        e.preventDefault();     // Stop from reloading page when submitted
        Login(details);
    }
    return (
        <div className={styles.body}>
            <form onSubmit={submitHandler}>
                <div className="form-inner">
                    <p className={styles.sign} align="center">Login</p>
                    {(error!=="")?(<div className={styles.error}>{error}</div>): ""}
                    <div className={styles.inner}>
                        <input className={styles.input} type="text" placeholder="Username" name="name" id="name" onChange={e=>setDetails({...details,email:e.target.value})} value={details.email}/>
                        <input className={styles.input} type="password" placeholder="Password" name="password" id="password" onChange={e=>setDetails({...details,password:e.target.value})} value={details.password}/>
                        <button className={styles.button} type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
