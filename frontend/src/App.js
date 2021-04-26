import React, {useState} from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import LiveStream from './components/LiveStream/LiveStream';

function App() {
  
  // In production code, the username and passwords will be fetched from a database 
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const [user,setUser] = useState({email:""});
  const [error,setError] = useState();

  // Function that checks login details and updates the state of the app
  // if login is successful
  const Login = details => {

    if(details.email===adminUser.email && details.password===adminUser.password){
      console.log("Logged in");
      setUser({
        email: details.email
      });
    }
    else{
      console.log("details dont match")
      setError("details dont match")
    } 
  }

  // Sets the state to logged out
  const Logout = () => {
    console.log("logout");
    setUser({email:""})
    setError("")
  }


  
  return (
    <div className="App">
      {(user.email!=="")?(
        <div className="Menu">
          <LiveStream />
          <button onClick={Logout}>Logout</button>
        </div>
      ):( 
        <LoginForm Login={Login} error ={error}/>
      )}
    </div>
  );
}

export default App;
