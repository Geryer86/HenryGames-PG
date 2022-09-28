import React from "react";
import GoogleButton from 'react-google-button';
import GoogleLogin from 'react-google-login';
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
//const { GOOGLE_CLIENT_ID } = process.env

export default function GoogleBtn({type}) {

    //const hk_URL = "https://henrygames.herokuapp.com"
    
    const BACK_HEROKU = process.env.REACT_APP_API || "http://localhost:3001";

    const responseGoogle = (response) => {
        console.log(response);
      }
    
    const google = () => {
        window.location.href = `${BACK_HEROKU}/auth/google`
    }
    
    return (
        <fragment>
            {/* <GoogleLogin
                clientId="1068714746325-oo9eg04cqgvfljp14dgjrbgaego7osqp.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            /> */}
            <GoogleButton
                type={type}
                label='Log in with Google'
                onClick={() => {google()}}
            />
        </fragment>
    )
}