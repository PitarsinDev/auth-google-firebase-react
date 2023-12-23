import './App.css';
import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase/firebaseConfig';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({})


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (result) => {
      if (result) {

        const {displayName, email} = result
        setUserData({ displayName, email })

        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }

    })

    return () => unsubscribe();
  },[])
  
  const SignUpUsingGoogle = () => {

    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {

        const { displayName, email } = result.user;
        setUserData({ displayName, email })

        setIsLoggedIn(true)
      }).catch((error) => {

        console.log({ error });

      });
  }

  const Logout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      setUserData({})
      setIsLoggedIn(false)
    }).catch((error) => {
      // An error happened.
      console.log({ error });
    });
  }

  return (
    <div className="App">

      {!isLoggedIn &&
        <div className='flexsign'>
        <button onClick={SignUpUsingGoogle} type="button" className="login-with-google-btn" >
        <span><ion-icon name="logo-google"></ion-icon></span> Sign in with Google
        </button>
        </div>
      }

      {isLoggedIn &&
        <div className="wrapper">
          <div className="profile-card js-profile-card">

            <div className="profile-card__cnt js-profile-cnt">
              <div className="name">Hello {userData.displayName} !</div>
              <div className="txt">email : {userData.email}</div>
              <div className="profile-card-loc">
              </div>
              <div className="profile-card-ctr">
                <button className="profile-card__button" onClick={Logout}>Log out</button>
              </div>
            </div>

          </div>
        </div>
      }



    </div>
  );
}

export default App;
