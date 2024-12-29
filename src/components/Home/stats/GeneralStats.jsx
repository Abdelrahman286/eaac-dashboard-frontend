import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  Group as GroupIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  AccountBox as AccountBoxIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

import QueryStatsIcon from "@mui/icons-material/QueryStats";
const DashboardStats = ({ data }) => {
  const stats = [
    {
      label: "Students",
      value: data?.numberOfActiveCompanies || "",
      icon: <PeopleIcon />,
    },
    {
      label: "Instructors",
      value: data?.numberOfActiveInstructors || "",
      icon: <SchoolIcon />,
    },
    {
      label: "Courses",
      value: data?.numberOfActiveCourses || "",
      icon: <EventIcon />,
    },
    {
      label: "Rounds",
      value: data?.numberOfActiveRounds || "",
      icon: <AccessTimeIcon />,
    },
    {
      label: "Sessions",
      value: data?.numberOfActiveSessions || "",
      icon: <AccountBoxIcon />,
    },
    {
      label: "Members",
      value: data?.numberOfActiveMemberships || "",
      icon: <GroupIcon />,
    },
    {
      label: "Companies",
      value: data?.numberOfActiveCompanies || "",
      icon: <BusinessIcon />,
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
        <QueryStatsIcon
          sx={{ fontSize: 32, color: "#1976d2", marginRight: 1 }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          General Statistics
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>{stat.icon}</Grid>
                  <Grid item>
                    <Typography variant="h6">{stat.label}</Typography>
                    <Typography variant="h5" color="primary">
                      {stat.value}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardStats;
