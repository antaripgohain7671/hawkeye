import React, {useState} from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import LiveStream from './components/LiveStream/LiveStream';
import Updates from './components/Updates/Updates';
import About from './components/About/About'
import './App.css'

function App() {
  
  // In production code, the username and passwords will be fetched from a database 
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const [user,setUser] = useState({email:""});
  const [error,setError] = useState();
  const [currentPage, setCurrentPage] = useState("livestream"); // This is relevant only after logging in

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
    console.log("Logged out");
    setUser({email:""})
    setError("")
  }

  function loadAbout()      { setCurrentPage("about")      }
  function loadLivestream() { setCurrentPage("livestream") }
  function loadUpdates()    { setCurrentPage("updates")    }


  


  return (
    <div className="App">
      {/* If logged in */ }
      {(user.email!=="")?(
        <div className="Menu">
          
          
          
          <div className="navbar">
                <div className="left">
                    <img className="logo" src="/images/logos/logo-transparent.png"></img>
                    <h1 className="home"> Hawk Eye </h1>
                </div>

                <div className="right">
                    <button onClick={loadLivestream} className="rightElement" href="/"> Livestream </button>
                    <button onClick={loadUpdates} className="rightElement" href="/"> Updates </button>
                    <button onClick={loadAbout} className="rightElement" href="/"> About </button>
                </div>
          </div>


          { currentPage == "about"      && <About />      }
          { currentPage == "livestream" && <LiveStream /> }
          { currentPage == "updates"    && <Updates />    }


          <button className="logoutbutton" onClick={Logout}>Logout</button>
        </div>
      
      /* If NOT logged in */
      ):( 
        <>
          <div className="navbar">
                
                <div className="left">
                    <img className="logo" src="/images/logos/logo-transparent.png"></img>
                    <h1 className="home"> Hawk Eye </h1>
                </div>
          </div>

          
          <LoginForm Login={Login} error ={error}/>
        </>
      )}
    </div>
  );
}

export default App;
