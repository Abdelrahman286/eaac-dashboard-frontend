import React, { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import "../../styles/loginPage.css";

// input components
import {
  TextField,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";

// icons
import { Visibility, VisibilityOff, Email, VpnKey } from "@mui/icons-material";

import TextInputAdornment from "../TextInputAdornment";
import FormButton from "../FormButton";

// validation
import { validateEmail } from "../../utils/requestValidations";
// requests
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordFn } from "../../requests/auth";
const ForgotPass = () => {
  const xs = {
    marginY: 2,
    width: {
      xs: "240px", // for small screens
      sm: "340px", // for medium and larger screens
    },
  };
  const { currentAuthPage, handleAuthPageTransition } = useContext(AppContext);
  const [forgotPasswordErr, setForgotPasswordErr] = useState({});
  const [forgotPassData, setForgotPassData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEmail(forgotPassData);
    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setForgotPasswordErr(errors);
    } else {
      setForgotPasswordErr({});
      sendForgotPassEmail(forgotPassData);
    }
  };

  const {
    mutate: sendForgotPassEmail,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationFn: forgotPasswordFn,

    onSuccess: (response) => {
      // move to send otp page
      handleAuthPageTransition("otpPage");
    },
    onError: (error) => {
      console.error("login failed", error);
    },
  });

  const handleDataChange = (e) => {
    setForgotPassData({ ...forgotPassData, [e.target.id]: e.target.value });
  };
  return (
    <div className="forgot-password-page fade-in-animation">
      <h2>Forgot Password</h2>

      <p>
        Please enter your email to change password An OTP code will be sent to
        your mail inbox.
      </p>

      {isError && <p className="invalid-message">unregistered email !</p>}
      <form>
        <TextInputAdornment
          id="email"
          value={forgotPassData?.email}
          label="Email"
          error={forgotPasswordErr?.email}
          handleChange={handleDataChange}
          icon={<Email />}
          sx={xs}
        ></TextInputAdornment>

        <FormButton
          isLoading={isPending}
          buttonText="SEND"
          className="main-btn"
          onClick={handleSubmit}
          type="submit"
        ></FormButton>
      </form>
    </div>
  );
};

export default ForgotPass;
