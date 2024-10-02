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
import PasswordInput from "../PasswordInput";
// validation
import {
  validateEmail,
  validateResetPassword,
} from "../../utils/requestValidations";
// requests
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordFn, resetPasswordFn } from "../../requests/auth";
import TextInputAdornment from "../TextInputAdornment";
import FormButton from "../FormButton";

const OtpForm = () => {
  const sx = {
    marginY: 2,
    width: {
      xs: "240px", // for small screens
      sm: "340px", // for medium and larger screens
    },
  };

  const { handleAuthPageTransition } = useContext(AppContext);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({});

  const handleDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateResetPassword(formData);
    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      // Proceed to send data if no errors
      resetPassword(formData);
    }
  };

  const {
    mutate: resetPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: resetPasswordFn,
    onSuccess: (response) => {
      handleAuthPageTransition("loginPage");
    },
    onError: (error) => {
      console.error("login failed", error);
    },
  });

  return (
    <div className="forgot-password-page fade-in-animation">
      <h2>Reset Password</h2>

      <p>An OTP Code is sent to your mail</p>

      {isError && (
        <p className="invalid-message">Incorrect OTP code, please try again!</p>
      )}
      <form>
        <TextInputAdornment
          id="email"
          error={formErrors?.email}
          value={formData?.email}
          label="Email"
          handleChange={handleDataChange}
          icon={<Email />}
          sx={sx}
        ></TextInputAdornment>

        <TextInputAdornment
          id="otp"
          error={formErrors?.otp}
          value={formData?.otp}
          label="OTP"
          handleChange={handleDataChange}
          icon={<VpnKey />}
          sx={sx}
        ></TextInputAdornment>

        <PasswordInput
          value={formData?.password}
          error={formErrors?.password}
          id="password"
          handleChange={handleDataChange}
          sx={sx}
          label="New Password"
        ></PasswordInput>

        <PasswordInput
          value={formData?.confirmPassword}
          error={formErrors?.confirmPassword}
          id="confirmPassword"
          handleChange={handleDataChange}
          sx={sx}
          label="Confirm Password"
        ></PasswordInput>

        <FormButton
          isLoading={isPending}
          buttonText="Reset Password"
          className="main-btn"
          onClick={handleSubmit}
          type="submit"
        ></FormButton>
      </form>
    </div>
  );
};

export default OtpForm;
