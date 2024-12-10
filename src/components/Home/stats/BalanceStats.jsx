import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import {
  AttachMoney,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  AccountBalance,
} from "@mui/icons-material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const Stats = () => {
  const cardData = [
    {
      label: "Cash",
      value: 150000,
      icon: <TrendingUp />,
      gradient: "linear-gradient(135deg, #4caf50, #81c784)", // Green gradient
    },
    {
      label: "Vodafone Cash",
      value: 12000,
      icon: <TrendingUp />,
      gradient: "linear-gradient(135deg, #f44336, #e57373)", // Red gradient
    },
    {
      label: "InstaPay",
      value: 500,
      icon: <TrendingUp />,
      gradient: "linear-gradient(135deg, #9c27b0, #ba68c8)", // Purple gradient
    },
  ];

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
