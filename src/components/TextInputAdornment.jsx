import React, { useState, useEffect } from "react";
import {
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
  IconButton,
} from "@mui/material";
const TextInputAdornment = ({
  id,
  value,
  error,
  handleChange,
  label,
  icon,
  sx,
}) => {
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
          htmlFor="outlined-adornment-email"
        >
          {label}
        </InputLabel>
        <Input
          startAdornment={
            <InputAdornment position="start">{icon}</InputAdornment>
          }
          onChange={handleChange}
          id={id}
          value={value || ""}
          type="text"
          label={label}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default TextInputAdornment;
