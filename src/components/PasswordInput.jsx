import React, { useState, useEffect } from "react";
import {
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
// icons
import { Visibility, VisibilityOff, Email, VpnKey } from "@mui/icons-material";
const PasswordInput = ({ error, id, value, handleChange, sx, label }) => {
  // ----------- show password states --------------
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <FormControl
        sx={
          sx ?? {
            marginY: 2,
            width: {
              xs: "240px", // for small screens
              sm: "300px", // for medium and larger screens
            },
          }
        }
        error={Boolean(error)}
      >
        <InputLabel
          sx={{
            marginLeft: -2,
            fontSize: 20,
          }}
          htmlFor="outlined-adornment-password"
        >
          {label ?? "Password"}
        </InputLabel>
        <Input
          startAdornment={
            <InputAdornment position="start">
              <VpnKey />
            </InputAdornment>
          }
          onChange={handleChange}
          id={id}
          value={value || ""}
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={label ?? "password"}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default PasswordInput;
