import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const Stats = ({ data }) => {
  let cardData = [];
  const gradients = [
    "linear-gradient(135deg, #9c27b0, #ba68c8)", // Purple gradient
    "linear-gradient(135deg, #3f51b5, #5c6bc0)", // Blue gradient
    "linear-gradient(135deg, #4caf50, #81c784)", // Green gradient
    "linear-gradient(135deg, #ff9800, #ffb74d)", // Orange gradient
    "linear-gradient(135deg, #f44336, #e57373)", // Red gradient
    "linear-gradient(135deg, #673ab7, #9575cd)", // Deep Purple gradient
    "linear-gradient(135deg, #00bcd4, #4dd0e1)", // Cyan gradient
    "linear-gradient(135deg, #ffeb3b, #fff176)", // Yellow gradient
    "linear-gradient(135deg, #e91e63, #f06292)", // Pink gradient
  ];

  function getRandomGradient() {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  if (
    Array.isArray(data?.paymentMethods) &&
    data?.paymentMethods?.length !== 0
  ) {
    cardData = data?.paymentMethods?.map((ele) => {
      return {
        label: ele?.name_en || "",
        value: Math.round(ele?.balance) || "0",
        icon: <TrendingUp />,
        gradient: getRandomGradient(),
      };
    });
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        background: "white",
        boxSizing: "border-box",
        width: "100%",
        borderRadius: "12px",
        margin: "20px 0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <AccountBalanceWalletIcon
          sx={{ fontSize: 32, color: "#1976d2", marginRight: 1 }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Balance Statistics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: card.gradient, // Apply the gradient here
                borderRadius: "12px",
                boxShadow: 2,
                height: "100%",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" sx={{ color: "white" }}>
                  {card.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mt: 1, color: "white" }}
                >
                  {card.value} EGP
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Stats;
