import React, {useState} from 'react'
import './styles.css';

export default function Loginform({Login, error}) {
    const [details,setDetails] = useState({email:"",password:""});

    const submitHandler = e =>{
        e.preventDefault();
        Login(details);
    }
    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Login</h2>
                {(error!=="")?(<div className="error">{error}</div>): ""}
                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input type="text" name="name" id="name" onChange={e=>setDetails({...details,email:e.target.value})} value={details.email}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="password" onChange={e=>setDetails({...details,password:e.target.value})} value={details.password}/>
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </div>
        </form>
    )
}
