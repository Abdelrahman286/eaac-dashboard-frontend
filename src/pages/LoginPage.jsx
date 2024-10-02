import React, { useEffect, useState, useContext } from "react";

//styles
import "../styles/loginPage.css";

// assets
import logo from "../assets/eaac-logo-240.png";

// components
import { Login } from "../components/Auth/Login";
import ForgotPass from "../components/Auth/ForgotPass";
import OtpForm from "../components/Auth/OtpForm";

// icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// context
import { AppContext } from "../contexts/AppContext";
const LoginPage = () => {
  const { currentAuthPage, handleAuthPageTransition } = useContext(AppContext);

  return (
    <div className="login-wrapper">
      <div className="login-content">
        <div className="company-logo">
          <img src={logo}></img>
        </div>

        {/* Auth Pages */}

        {currentAuthPage == "loginPage" && <Login></Login>}
        {currentAuthPage == "forgotPassPage" && <ForgotPass></ForgotPass>}
        {currentAuthPage == "otpPage" && <OtpForm></OtpForm>}

        {/* Navigation Keys */}
        {currentAuthPage == "loginPage" && (
          <div className="forget-password">
            <p onClick={() => handleAuthPageTransition("forgotPassPage")}>
              Forgot Password?
            </p>
          </div>
        )}

        {currentAuthPage == "forgotPassPage" && (
          <div className="back-to-login">
            <p onClick={() => handleAuthPageTransition("loginPage")}>
              <KeyboardBackspaceIcon></KeyboardBackspaceIcon>
              <span> Back to Login</span>
            </p>
          </div>
        )}

        {currentAuthPage == "otpPage" && (
          <div className="back-to-login">
            <p onClick={() => handleAuthPageTransition("loginPage")}>
              <KeyboardBackspaceIcon></KeyboardBackspaceIcon>
              <span> Back to Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
