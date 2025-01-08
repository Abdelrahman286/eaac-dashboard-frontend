import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import imageIcon from "./shorcutsIcons/img.png";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import {
  School,
  Group,
  PersonAdd,
  Payments,
  Receipt,
  BarChart,
  AddCircle,
  Assessment,
  AccountBalance,
  CalendarViewMonth,
} from "@mui/icons-material";

const Shortcuts = () => {
  const navigate = useNavigate();
  //   const shortcuts = [
  //     {
  //       icon: imageIcon,
  //       label: "Student Attendance",
  //       link: "/attendance/students",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Instructor Attendance",
  //       link: "/attendance/instructors",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Add Student",
  //       link: "/students?action=add",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Add Instructor",
  //       link: "/instructors?action=add",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Student Payment",
  //       link: "/accounting/client-payments",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Add Expenses",
  //       link: "/settings/expenses-types?action=add",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Enroll Student",
  //       link: "/students",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Membership",
  //       link: "/membership",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "Financial Reports",
  //       link: "/financial-reports",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "View Rounds",
  //       link: "/rounds",
  //     },
  //     {
  //       icon: imageIcon,
  //       label: "New Round",
  //       link: "/rounds?action=add",
  //     },
  //   ];

  const shortcuts = [
    {
      icon: <School fontSize="large" />,
      label: "Student Attendance",
      link: "/attendance/students",
    },
    {
      icon: <Group fontSize="large" />,
      label: "Instructor Attendance",
      link: "/attendance/instructors",
    },
    {
      icon: <PersonAdd fontSize="large" />,
      label: "Add Student",
      link: "/students?action=add",
    },
    {
      icon: <PersonAdd fontSize="large" />,
      label: "Add Instructor",
      link: "/instructors?action=add",
    },
    {
      icon: <Payments fontSize="large" />,
      label: "Student Payment",
      link: "/accounting/client-payments",
    },
    {
      icon: <Receipt fontSize="large" />,
      label: "Add Expenses",
      //   link: "/settings/expenses-types?action=add",
      link: "/accounting/account-payments?action=add",
    },
    {
      icon: <AddCircle fontSize="large" />,
      label: "Enroll Student",
      link: "/students",
    },
    {
      icon: <Assessment fontSize="large" />,
      label: "Membership",
      link: "/membership",
    },
    {
      icon: <BarChart fontSize="large" />,
      label: "Financial Reports",
      link: "/financial-reports",
    },
    {
      icon: <CalendarViewMonth fontSize="large" />,
      label: "View Rounds",
      link: "/rounds",
    },
    {
      icon: <AddCircle fontSize="large" />,
      label: "New Round",
      link: "/rounds?action=add",
    },
  ];
  return (
    <Box
      sx={{
        padding: 2,
        background: "white",
        boxSizing: "border-box",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <ShortcutIcon sx={{ fontSize: 32, color: "#1976d2", marginRight: 1 }} />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Shortcuts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {shortcuts.map((shortcut, index) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={index}
            sx={{ marginBottom: 2 }}
          >
            <Card
              onClick={() => {
                navigate(shortcut?.link);
              }}
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: 2,
                paddingBottom: 0,
                height: "100%",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, background-color 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "#f5faff",
                },
              }}
            >
              <Box
                sx={{
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 1.5,
                }}
              >
                {/* <CardMedia
                  component="img"
                  image={shortcut.icon}
                  alt={shortcut.label}
                  sx={{ width: 30, height: 30 }}
                /> */}

                {shortcut?.icon}
              </Box>
              <CardContent sx={{ padding: "8px 0 0 0" }}>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {shortcut.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Shortcuts;
