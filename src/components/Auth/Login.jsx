import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/loginPage.css";

// input components
import {
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";
// icons
import { Email } from "@mui/icons-material";

// utils
import { validateLoginData } from "../../utils/requestValidations";
// requests
import { loginFn } from "../../requests/auth";
import PasswordInput from "../PasswordInput";
import TextInputAdornment from "../TextInputAdornment";
import FormButton from "../FormButton";
export const Login = () => {
  // global context data
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({});

  const [loginErr, setLoginErr] = useState({});

  const handleDataChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const {
    mutate: sendLoginData,
    isPending,
    isError,
  } = useMutation({
    mutationFn: loginFn,
    onSuccess: (response) => {
      const token = response.success.response.token;
      const userData = response.success.response.data;

      login(token, userData);
      navigate("/");
    },
    onError: (error) => {
      console.error("login failed", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateLoginData(loginData);
    if (Object.keys(errors).length > 0) {
      setLoginErr(errors);
    } else {
      setLoginErr({});
      sendLoginData(loginData);
    }
  };

  return (
    <div className="companies-form-page fade-in-animation">
      <form className="login-form ">
        <h2>LOGIN</h2>
        {isError && <p className="invalid-message">invalid credientials !</p>}

        <TextInputAdornment
          id="email"
          error={loginErr?.email}
          value={loginData?.email}
          label="Email"
          handleChange={handleDataChange}
          icon={<Email />}
        ></TextInputAdornment>

        <PasswordInput
          value={loginData?.password}
          error={loginErr?.password}
          id={"password"}
          handleChange={handleDataChange}
        ></PasswordInput>

        <FormButton
          isLoading={isPending}
          buttonText="LOGIN"
          className="main-btn"
          onClick={handleSubmit}
          type="submit"
        ></FormButton>
      </form>
    </div>
  );
};

export default Login;
